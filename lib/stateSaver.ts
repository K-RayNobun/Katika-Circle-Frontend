import { Store } from "redux";

export const provideState = (store: Store) => {
    const state = store.getState()
    const text =  JSON.stringify(state, null, 2);

    const blob = new Blob([text], {type: 'text/plain'})
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link =  document.createElement('a')
    link.href = url
    link.download = 'session_state.txt'

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}