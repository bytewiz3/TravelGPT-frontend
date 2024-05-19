import { defineStore } from 'pinia';

interface mapEventState {
    msg: object,
    curMenu: string
}

export const useMapStore = defineStore('map', {
    state: (): mapEventState => ({
        msg: { 'model': 'module1', event: 'home' },
        curMenu: 'company'
        // msg: {},
    }),
    actions: {
        updateMessage(e: object) {
            this.msg = e
        },
        updateCurMenu(e: string) {
            this.curMenu = e
        }
    },
});