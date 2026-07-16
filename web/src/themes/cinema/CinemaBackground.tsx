import { useAppMotion } from '../../motion/motionSystem';

export function CinemaBackground() {
  const { reduced, documentHidden } = useAppMotion();
  return (
    <div
      className="cinema-ambient"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 0%, #141414 70%)',
        backgroundColor: '#141414'
      }}
    ><i style={{ animationPlayState: reduced || documentHidden ? 'paused' : 'running' }} /></div>
  );
}
