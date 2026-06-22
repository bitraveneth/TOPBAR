/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
function LovedRibbon({ text, className = '' }) {
  return (
    <div className={`loved-header${className ? ` ${className}` : ''}`}>
      <div className="loved-checker" />
      <h1 className="loved-title">{text}</h1>
      <div className="loved-checker" />
    </div>
  )
}

export default LovedRibbon
