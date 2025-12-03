import './JackOLanternGlow.css';

/**
 * JackOLanternGlow Component
 * Creates pulsing jack-o'-lantern glow effects in the background
 */
export const JackOLanternGlow = () => {
  return (
    <div className="jack-o-lantern-container">
      <div className="jack-glow jack-glow-1"></div>
      <div className="jack-glow jack-glow-2"></div>
      <div className="jack-glow jack-glow-3"></div>
      <div className="jack-glow jack-glow-4"></div>
      <div className="jack-glow jack-glow-5"></div>
    </div>
  );
};
