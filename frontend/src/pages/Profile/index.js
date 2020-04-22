import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'
import './style.css';
import api from '../../services/api';

export default function Profile() {

    const [incidents, setIncidents] = useState([]);
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    const history = useHistory();

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data)
        })
    }, [ongId]);

    async function handlerDeleteIncident(id){
        try {
            await api.delete(`incidents/${id}`, {
                headers:{
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            alert('Erro ao deleter caso, tente novamente.');
        }
    }

    function handleLogout(){
        localStorage.clear()
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the hero" />
                <span>Bem vinda, {ongName}</span>
                <Link to="/incidents/new" className="button">Cadastrar Novo Caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#e02041"></FiPower>
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {
                    incidents.map(incidents => (
                        <li key={incidents.id}>
                            <strong>CASO:</strong>
                            <p>{incidents.title}</p>

                            <strong>DESCRIÇÃO:</strong>
                            <p>{incidents.description}</p>

                            <strong>VALOR</strong>
                            <p>{Intl.NumberFormat('pt-BR',{
                                style:'currency',
                                currency:'BRL'
                            }).format(incidents.value)}</p>

                            <button type="button" onClick={() => handlerDeleteIncident(incidents.id)}>
                                <FiTrash2 size={20} color="a8a8b3" />
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}