import { Alert } from 'react-bootstrap'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className="container">
      {notification && <Alert variant="success">{notification.message}</Alert>}
    </div>
  )
  /*
  const style = {
    color: notification.type === 'alert' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }


  return (
    <div id="notification" style={style}>
      {notification.message}
    </div>
  )
  */
}

export default Notification
