import api from './api';

class ProfileService {
    updateProfileInfo(data) {
        return api.put('/profile/info', data);
    }

    changePassword(data) {
        return api.put('/profile/password', data);
    }

    uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        return api.post('/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

export default new ProfileService();
