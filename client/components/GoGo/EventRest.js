import Axios from "axios";
class EventRest {
    findEvent(eventId) {
        return Axios.get('api/public/gogo/event/' + eventId).then(response => {
            console.log(response.data);
            return response.data;
        });
    }

    updateUser(eventId, update) {
        let url = 'api/public/gogo/event/:eventId/user';
        url = url.replace(':eventId', eventId);
        return Axios.post(url, update).then(response => {
            console.log(response.data);
            return response.data;
        });
    }

    deleteUser(eventId, userId) {
        let url = 'api/public/gogo/event/:eventId/user/:userId';
        url = url.replace(':eventId', eventId).replace(':userId', userId);
        return Axios.delete(url).then(response => {
            console.log(response.data);
            return response.data;
        });
    }

    updateSection(section) {
        const url = 'api/public/gogo/section';
        return Axios.put(url, section).then(response => {
            console.log(response.data);
            return response.data;
        });
    }

    updateEvent(event) {
        const url = 'api/public/gogo/event';
        return Axios.put(url, event).then(response => {
            console.log(response.data);
            return response.data;
        });
    }

    createEvent(name, email) {
        const url = '/api/public/gogo/event';
        const param = {name, email};
        return Axios.post(url, param).then(response => {
            console.log(response.data);
            return response.data;
        });
    }
}
export default new EventRest();
