import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sliders, Headphones, Play, Pause, AlertCircle, X } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  description: string;
  volume: number; // 0 to 100
  color: string;
}

export default function LofiAuraMixer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Channels volume state
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'synth', name: 'Aura Drone', description: 'Deep space synthwave swell', volume: 40, color: 'from-pink-500 to-purple-600' },
    { id: 'rain', name: 'Soothing Rain', description: 'White-noise bandpass rainscape', volume: 30, color: 'from-blue-400 to-teal-500' },
    { id: 'vinyl', name: 'Vinyl Dust', description: 'Retro dusty record player crackles', volume: 15, color: 'from-amber-400 to-orange-500' },
    { id: 'pulse', name: 'Ambient Pulse', description: 'Deep low-pass heart beating baseline', volume: 20, color: 'from-indigo-500 to-violet-600' }
  ]);

  // Audio nodes refs to keep reference alive for real-time adjusting
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isSetupRef = useRef(false);

  // Individual volume gains
  const channelGainsRef = useRef<Record<string, GainNode>>({});
  // Oscillators and sound sources to terminate when pausing
  const activeSourcesRef = useRef<any[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const setupAudioContext = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("Browser does not support Web Audio API.");
      return;
    }
    audioCtxRef.current = new AudioContextClass();
    masterGainRef.current = audioCtxRef.current.createGain();
    masterGainRef.current.gain.setValueAtTime(0.8, audioCtxRef.current.currentTime);
    masterGainRef.current.connect(audioCtxRef.current.destination);
  };

  const startAllAudio = async () => {
    setupAudioContext();
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    setLoading(true);

    try {
      // 1. Channel 1: Aura Synth swell
      const synthGain = ctx.createGain();
      synthGain.gain.setValueAtTime((channels.find(c => c.id === 'synth')?.volume || 0) / 100, ctx.currentTime);
      synthGain.connect(masterGain);
      channelGainsRef.current['synth'] = synthGain;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.value = 55; // A1 low pitch
      osc2.frequency.setValueAtTime(55.2, ctx.currentTime); // Slight detune

      // Sweeping filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.Q.value = 5;

      // Filter modulation LFO
      const filterLfo = ctx.createOscillator();
      filterLfo.type = 'sine';
      filterLfo.frequency.value = 0.08; // Very slow sweep (12 seconds)
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(120, ctx.currentTime);

      filterLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(synthGain);

      osc1.start();
      osc2.start();
      filterLfo.start();

      activeSourcesRef.current.push(osc1, osc2, filterLfo);


      // 2. Channel 2: Cozy Rain simulation via Noise buffer
      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime((channels.find(c => c.id === 'rain')?.volume || 0) / 100, ctx.currentTime);
      rainGain.connect(masterGain);
      channelGainsRef.current['rain'] = rainGain;

      // Pre-fill a 2-second white-noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Bandpass filter to make it sound like cozy soft rain
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(950, ctx.currentTime);
      rainFilter.Q.value = 1.2;

      // Sweep rain volume slightly over time to simulate dynamic breeze
      const rainLfo = ctx.createOscillator();
      rainLfo.frequency.value = 0.15; // 6 seconds loop
      const rainLfoGain = ctx.createGain();
      rainLfoGain.gain.setValueAtTime(0.15, ctx.currentTime);
      rainLfo.connect(rainLfoGain);
      rainLfoGain.connect(rainGain.gain);

      noiseSource.connect(rainFilter);
      rainFilter.connect(rainGain);

      noiseSource.start();
      rainLfo.start();

      activeSourcesRef.current.push(noiseSource, rainLfo);


      // 3. Channel 3: Vinyl crackling clicks buffer
      const vinylGain = ctx.createGain();
      vinylGain.gain.setValueAtTime((channels.find(c => c.id === 'vinyl')?.volume || 0) / 100, ctx.currentTime);
      vinylGain.connect(masterGain);
      channelGainsRef.current['vinyl'] = vinylGain;

      const vinylBufferSize = ctx.sampleRate * 2.5;
      const vinylBuffer = ctx.createBuffer(1, vinylBufferSize, ctx.sampleRate);
      const vOut = vinylBuffer.getChannelData(0);
      for (let i = 0; i < vinylBufferSize; i++) {
        // High density silence with random spike impulses
        vOut[i] = Math.random() > 0.99955 ? (Math.random() * 2 - 1) * 0.15 : 0;
        // Introduce some low rumblings
        vOut[i] += Math.sin(i * 0.001) * 0.005;
      }

      const vinylSource = ctx.createBufferSource();
      vinylSource.buffer = vinylBuffer;
      vinylSource.loop = true;

      const vinylFilter = ctx.createBiquadFilter();
      vinylFilter.type = 'highpass';
      vinylFilter.frequency.setValueAtTime(100, ctx.currentTime);

      vinylSource.connect(vinylFilter);
      vinylFilter.connect(vinylGain);

      vinylSource.start();
      activeSourcesRef.current.push(vinylSource);


      // 4. Channel 4: Cozy Sub Pulse Heartbeat
      const pulseGain = ctx.createGain();
      pulseGain.gain.setValueAtTime((channels.find(c => c.id === 'pulse')?.volume || 0) / 100, ctx.currentTime);
      pulseGain.connect(masterGain);
      channelGainsRef.current['pulse'] = pulseGain;

      // Low frequency heartbeat oscillator modulation
      const pulseOsc = ctx.createOscillator();
      pulseOsc.type = 'sine';
      pulseOsc.frequency.setValueAtTime(50, ctx.currentTime); // Deep warm low bass

      const pulseLfo = ctx.createOscillator();
      pulseLfo.type = 'sawtooth';
      pulseLfo.frequency.setValueAtTime(0.66, ctx.currentTime); // 90 BPM heartbeat rate swing

      const pulseLfoGain = ctx.createGain();
      pulseLfoGain.gain.setValueAtTime(0.5, ctx.currentTime);

      const pulseFilter = ctx.createBiquadFilter();
      pulseFilter.type = 'lowpass';
      pulseFilter.frequency.setValueAtTime(60, ctx.currentTime);

      pulseLfo.connect(pulseLfoGain);
      pulseLfoGain.connect(pulseGain.gain);

      pulseOsc.connect(pulseFilter);
      pulseFilter.connect(pulseGain);

      pulseOsc.start();
      pulseLfo.start();

      activeSourcesRef.current.push(pulseOsc, pulseLfo);

      isSetupRef.current = true;
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio generation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const stopAllAudio = () => {
    try {
      activeSourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e){}
      });
      activeSourcesRef.current = [];
      channelGainsRef.current = {};
      isSetupRef.current = false;
      setIsPlaying(false);
    } catch (err) {
      console.warn("Error terminating sound oscillators", err);
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopAllAudio();
    } else {
      await startAllAudio();
    }
  };

  const handleVolumeChange = (id: string, value: number) => {
    // Update react state
    setChannels(prev => prev.map(c => c.id === id ? { ...c, volume: value } : c));

    // Live update direct gain nodes
    const targetGain = channelGainsRef.current[id];
    if (targetGain && audioCtxRef.current) {
      targetGain.gain.linearRampToValueAtTime(value / 100, audioCtxRef.current.currentTime + 0.1);
    }
  };

  return (
    <>
      {/* Floating circular controller button (Left Corner) */}
      <div className="fixed bottom-6 left-6 z-40" id="lofi-aura-floating-widget">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg border backdrop-blur-md relative ${
            isPlaying
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-purple-500'
              : 'bg-white/90 text-neutral-800 border-neutral-200 hover:bg-neutral-50'
          }`}
          title="Space Aura Lofi Mixer"
        >
          {isPlaying ? (
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-500 animate-ping opacity-30" />
          ) : null}

          {isPlaying ? (
            <Headphones className="w-5 h-5 animate-bounce" />
          ) : (
            <Sliders className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Floating expand panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-22 left-6 z-40 w-80 rounded-3xl bg-[#0B0B0E]/95 backdrop-blur-lg border border-white/10 text-white p-5 shadow-2xl-strong text-left space-y-4"
          >
            {/* Header segment of the audio mixdesk */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-pink-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm tracking-tight text-white leading-none">Trendzo Aura Synth</h4>
                  <span className="text-[9px] font-mono text-neutral-400">Workspace Sound Mixer</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mixer desk guidelines summary */}
            <p className="text-[10px] text-neutral-400 leading-relaxed pt-1">
              Mix our procedural browser synthesized sound streams to create a calming, cyberpunk study space.
            </p>

            {/* Master Toggle Console */}
            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-4">
              <div className="text-left font-sans">
                <span className="block text-[8px] font-mono text-neutral-400 tracking-wider">MASTER POWER</span>
                <span className="text-xs font-bold text-white uppercase">{isPlaying ? 'Streaming Active' : 'Sound Deck Stopped'}</span>
              </div>

              <button
                onClick={handleTogglePlay}
                disabled={loading}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 text-white active:scale-95 ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-pink-500 from-10% via-purple-600 to-indigo-600'
                }`}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    Mute
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play Synth
                  </>
                )}
              </button>
            </div>

            {/* Channels lists detail sliders */}
            <div className="space-y-3.5 pt-1">
              {channels.map((chan) => (
                <div key={chan.id} className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-neutral-200">{chan.name}</span>
                    <span className="font-mono text-neutral-400 font-bold">{chan.volume}%</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] text-neutral-500 font-mono w-8 truncate uppercase">{chan.id}</span>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      disabled={!isPlaying}
                      value={chan.volume}
                      onChange={(e) => handleVolumeChange(chan.id, Number(e.target.value))}
                      className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Safe operational disclaimer */}
            <div className="flex items-start gap-1.5 text-[8px] text-neutral-500 pt-2 border-t border-white/5 font-mono">
              <AlertCircle className="w-3 h-3 text-pink-500/60 flex-shrink-0 mt-0.5" />
              <span>Offline procedural digital synthesis. No internet cookies or external bandwidth required.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
