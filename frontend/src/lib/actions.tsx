import api from "../service/api";
import type { LockerProps } from "../types/locker";
import type { CompartimentoProps } from "../types/compartimento";
import axios from 'axios';

export async function postLocker(new_locker: LockerProps){
    console.log("Entrou no metodo")
    const dados = {
        localizacao: new_locker.localizacao,
    };

    try {
        const response = await api.post('/locker', dados)

        return response;
    }
    catch (error){
        console.error("Erro ao fazer post do locker:", error);
        throw error;
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

export async function postCompartimento(new_comp: CompartimentoProps){
    const dados = {
        locker_id: new_comp.locker_id,
        tamanho: new_comp.tamanho
    }

    console.log(dados.locker_id);
    try {
        const res = await api.post(`/locker/compartimento/${dados.locker_id}`, dados);

        console.log(res);
        return res
    } catch (error) {
        console.error("Erro ao alocar compartimento ", error);

        if (axios.isAxiosError(error) && error.response){
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            return res
        }
    }
}