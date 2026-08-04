import api from "../service/api";
import type { LockerProps } from "../types/locker";

export async function postLocker(new_locker: LockerProps){
    console.log("Entrou no metodo")
    const dados = {
        localizacao: new_locker.localizacao,
    };
    try {
        const response = await api.post('/locker', dados)
        console.log(response)
        const json = response.data;

        return json;
    }
    catch (error){
        console.error("Erro ao fazer post do locker:", error);
        return "Erro no servidor";
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
            
            console.log(json)
            return json;
        }
    } catch (error) {
        console.error("Erro ao fazer get dos lockers", error);
        return [];
    }
}