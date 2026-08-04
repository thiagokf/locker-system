import api from "../service/api";
import type { Locker } from "../types/locker";

export async function postLocker(new_locker: Locker){
    console.log("Entrou no metodo")
    const dados = {
        localizacao: new_locker.loc,
    };
    try {
        const response = await api.post('/locker', dados)
        console.log(response)
        const json = response.data;

        return json.status
    }
    catch (error){
        console.error("Erro ao fazer post do locker:", error);
        return "Erro no servidor";
    }
}