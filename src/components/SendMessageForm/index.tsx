import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api'
import stylos from './styles.module.scss'


export function SendMessageForm(){
    const { user, signOut } = useContext(AuthContext)
    const [message, setMessage] = useState('')

    async function addMessage(event: FormEvent){
        event.preventDefault()
        
        if(!message.trim()){
            return;
        }

        await api.post('messages', {message})

        setMessage('')

        
    }

    return(
       <div className={stylos.sendMessageFormWrapper}>
           <button onClick={signOut} className={stylos.signOutButton}>
                <VscSignOut size='32'/>
           </button>

           <header className={stylos.userInformation}>
                <div className={stylos.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={stylos.userName}>{user?.name}</strong>
                <span className={stylos.userGitHub}>
                    <VscGithubInverted size='16' />
                    {user?.login}
                </span>
           </header>
           <form onSubmit={addMessage} className={stylos.sendMessageForm}>
               <label htmlFor="message">Mensagem</label>
               <textarea 
                name="message" id="message"
                placeholder="Qual sua expectativa para o evento?"
                onChange={event => setMessage(event.target.value)}
                value={message}
                />
                <button type="submit">Enviar Mensagem</button>

           </form>
       </div>
    )
}