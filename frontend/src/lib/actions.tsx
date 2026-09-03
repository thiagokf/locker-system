import axios, { AxiosError, isAxiosError } from 'axios';
import api from "../service/api";
import type { LockerProps } from "../types/locker";
import type { CompartimentoProps } from "../types/compartimento";
import type { EntregaProps } from "../types/entrega";
import type { LogsProps } from '../types/logs';

export async function postLocker(new_locker: LockerProps) {
    const dados = {
        localizacao: new_locker.localizacao,
    };

    try {
        const response = await api.post('/locker', dados)

        return response;
    }
    catch (error) {
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
        const response = await api.delete(`/locker/${id}`);

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

export async function postCompartimento(new_comp: CompartimentoProps) {
    const dados = {
        locker_id: new_comp.locker_id,
        tamanho: new_comp.tamanho
    }

    try {
        const res = await api.post(`/locker/compartimento/${dados.locker_id}`, dados);

        return res
    } catch (error) {
        console.error("Erro ao alocar compartimento ", error);

        if (axios.isAxiosError(error) && error.response) {
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            return res
        }
    }
}

export async function getCompartimentos(locker_id: string) {
    try {
        const res = await api.get(`/locker/compartimento/${locker_id}`)
        if (!res) {
            console.log("nenhum compartimento alocado")
            return []
        }
        return res.data
    } catch (error) {
        console.error("erro ao ver compartimentos ", error);

        if (axios.isAxiosError(error) && error.response) {
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            return res.data
        }
    }
}

export async function getCompStatus(locker_id: string, tamanho: string) {
    try {
        const res = await api.get(`/locker/compartimento/${locker_id}/${tamanho}`)

        if (!res) {
            console.log("nenhum compartimento disponivel");
            return [];
        }
        return res.data;
    } catch (error) {
        console.error("error no get dos compartimentos ", error)

        if (axios.isAxiosError(error) && error.response) {
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            return res.data
        }
    }
}

export async function deleteComp(id: number) {
    try {
        console.log(id);
        const res = await api.delete(`/locker/compartimento/${id}`);
        console.log(res);
        return res
    }
    catch (error){
        console.error("Erro ao deletar compartimento: " + error);

        if (axios.isAxiosError(error) && error.response) {
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            console.log("catch!");

            return res
        }
    }
}

export async function getEntregas() {
    try {
        const dados = await api.get('/entregas')
        const res = dados.data

        return res
    }
    catch (error) {
        console.error("Erro ao buscar entregas", error)
    }
}

export async function postEntrega(new_entrega: EntregaProps) {
    if (!new_entrega) {
        console.log("faltando requisito");
        return
    }
    console.log(new_entrega);

    const dados = {
        locker_id: new_entrega.locker_id,
        compartimento_id: new_entrega.compartimento_id,
        tamanho: new_entrega.tamanho_pedido
    }
    try {
        console.log("entrou no try")
        const res = await api.post('/entregas/depositar', dados)
        console.log(res.data.message);
        return res
    }
    catch (error) {
        console.error("erro no servidor: ", error);
    }
}

export async function retirarEntrega(codigo_retirada: string) {
    if (!codigo_retirada) {
        console.log("erro de req");
        return
    }

    try {
        const res = await api.post(`/entregas/retirada/${codigo_retirada}`)

        return res
    }
    catch (error){
        console.error("Erro ao retirar entrega: ", error);

        if (axios.isAxiosError(error) && error.response) {
            const res = {
                status: error.response.status,
                data: error.response.data
            }
            return res.data
        }
    }
}

export async function getLogs(): Promise<LogsProps[]>{
    try {
        const res = await api.get('/logs');
        
        console.log(res.data)
        return res.data
    }
    catch (error) {
        console.error("erro ao pegar logs: ", error)
        return [];
    }
}