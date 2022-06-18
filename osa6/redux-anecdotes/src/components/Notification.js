//import { useSelector } from 'react-redux'
import { connect } from 'react-redux'
/*
const Notification = () => {
  
  const notification = useSelector(({ notification }) => {
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
    return (
      <div style={style}>
        {notification}
      </div>
    )
  })
  return notification
}
export default Notification
*/

const Notification = (props) => {
  
  const notification = notification => {
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
  return notification(props.notification)
}

const mapStateToProps = (state) => {
  return {notification: state.notification}
}

export default connect(
  mapStateToProps
)(Notification)