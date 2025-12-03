import './CandlelightEffect.css';

/**
 * CandlelightEffect Component
 * Creates flickering candlelight animation around the edges of the screen
 */
export const CandlelightEffect = () => {
  return (
    <div className="candlelight-container">
      <div className="candlelight candlelight-top-left"></div>
      <div className="candlelight candlelight-top-right"></div>
      <div className="candlelight candlelight-bottom-left"></div>
      <div className="candlelight candlelight-bottom-right"></div>
    </div>
  );
};
