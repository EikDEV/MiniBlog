import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './Register.module.css';
import { useState, useEffect } from 'react';
import loadingGif from '../images/loading.gif';

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const {createUser, error: authError, loading} = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = {
      displayName,
      email,
      password
    }

    if(password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    const res = await createUser(user);
    console.log(res);

  };

  useEffect(() => {
    if(authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.register}>
        <h1>Cadastre-se para postar</h1>
        <p>Crie seu usuário e compartilhe suas histórias</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input type="text" name='displayname' placeholder='Digite seu nome.' value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </label>
          <label>
            <span>E-mail</span>
            <input type="email" name='email' placeholder='Digite seu e-mail.' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            <span>Senha</span>
            <input type="password" name='password' placeholder='Digite sua senha.' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            <span>Confirme sua senha</span>
            <input type="password" name='confirmPassword' placeholder='Digite novamente sua senha.' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
          {!loading && <button className='btn'>Cadastrar</button>}
          {loading && <img src={loadingGif} alt='Carregando...'/>}
          {error && <p className='error'>{error}</p>}
        </form>
    </div>
  );
}

export default Register;