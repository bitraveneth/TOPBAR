export default function CmsSaveBar({ onSave, saving, disabled, message, hideSave }) {
  return (
    <div className="admin-cms-save-bar">
      {!hideSave ? (
        <button type="button" className="admin-btn" onClick={onSave} disabled={saving || disabled}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      ) : null}
      {message?.text ? (
        <p className={`admin-msg ${message.type === 'ok' ? 'admin-msg--ok' : 'admin-msg--err'}`}>{message.text}</p>
      ) : null}
    </div>
  )
}
