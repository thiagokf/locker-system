import api from "../service/api";
import type { LockerProps } from "../types/locker";
import axios from 'axios';

export async function postLocker(new_locker: LockerProps){
    console.log("Entrou no metodo")
    const dados = {
        localizacao: new_locker.localizacao,
    };

    const response = {
        "status": 0,
        "data": "Erro no servidor"
    }
    try {
        const response = await api.post('/locker', dados)

        return response;
    }
    catch (error){
        console.error("Erro ao fazer post do locker:", error);
        return response
    }
}

export async function getLockers(): Promise<LockerProps[]> {
    try {
        const response = await api.get('/locker');
        if (!response) {
            console.log("nenhum locker adicionado")
            return []
        } else {
            const json = response.data;
            return json;
        }
    } catch (error) {
        console.error("Erro ao fazer get dos lockers", error);
        return [];
    }
}

export async function deleteLocker(id: number) {
    try {
        console.log('netrou no try')
        const response = await api.delete(`/locker/${id}`);
 
        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Erro ao deletar locker:', error);
        
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: error.response.status,
                data: error.response.data
            }
        }

        return {
            status: 500,
            data: "Erro de conexão do servidor"
        }
    }
}