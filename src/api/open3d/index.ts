import request from '/@/utils/request';

const api = {
    findCompanyProfile: () => {
        return request({
            url: '/company/overview/findCompanyProfile',
            method: 'get',
        });
    }
}


export default api;