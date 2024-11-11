import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return ''
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const context = useContext(NotificationContext)
    return context[0]
}

export const useNotificationDispatch = () => {
    const context = useContext(NotificationContext)
    return context[1]
}

export default NotificationContext

export const setNotification = (dispatch, message, duration) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, duration * 1000)
}