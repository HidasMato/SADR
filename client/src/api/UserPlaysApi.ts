import UserPlaysService from './services/UserPlaysService.ts';
import { MasterPlays, GamerPlays } from './models/UserPlays.ts';

export default class UserPlaysApi {
    static async getGamerPlays(id: number): Promise<{ status: number, plays?: GamerPlays[], message?: string; }> {
        try {
            return {
                status: 200,
                plays: (await UserPlaysService.getGamerPlays(id)).data.plays
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
    static async getMasterPlays(id: number): Promise<{ status: number, plays?: MasterPlays[], message?: string; }> {
        try {
            return {
                status: 200,
                plays: (await UserPlaysService.getMasterPlays(id)).data.plays
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
} 