import { createStore } from 'vuex';
import axiosClient from '@/axios';

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem('TOKEN'),
      isAdmin: false,
    },
    dashboard: {
      loading: false,
      data: {},
    },
    surveys: {
      loading: false,
      data: [],
    },
    currentSurvey: {
      data: {},
      loading: false,
    },
    questionTypes: ['text', 'select', 'radio', 'checkbox', 'textarea'],
    notification: {
      show: false,
      type: 'success',
      message: '',
    },
  },

  getters: {
    isAdmin(state) {
      return state.user.isAdmin;
    },
  },

  actions: {
    async register({ commit }, user) {
      const userdata ={
        username: user.name,
        email: user.email,
        password: user.password,
      }
      try {
        const { data } = await axiosClient.post('/auth/signup', userdata);
        commit('setUser', data.user);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async login({ commit }, user) {
      try {
        const { data } = await axiosClient.post('/auth/signin', user);
        console.log(data);
        commit('setUser', data.user);
        commit('setToken', data.token);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async logout({ commit }) {
      try {
        await axiosClient.post('/auth/signout');
        commit('logout');
      } catch (error) {
        throw error;
      }
    },
    async getUser({ commit }) {
      try {
        const { data } = await axiosClient.get('/users/loggedIn');
        commit('setUser', data);
      } catch (error) {
        throw error;
      }
    },
    async getDashboardData({ commit }) {
      commit('dashboardLoading', true);
      try {
        const { data } = await axiosClient.get('/survey/dashboard');
        // console.log(data); 
        commit('setDashboardData', data);
      } catch (error) {
        throw error;
      } finally {
        commit('dashboardLoading', false);
      }
    },
    async getSurveys({ commit }, url = '/survey/') {
      commit('setSurveysLoading', true);
      try {
        const { data } = await axiosClient.get(url);
        // console.log(data); 
        commit('setSurveys', data);
      } catch (error) {
        throw error;
      } finally {
        commit('setSurveysLoading', false);
      }
    },
    async getSurvey({ commit }, id) {
      commit('setCurrentSurveyLoading', true);
      try {
        const { data } = await axiosClient.get(`/survey/${id}`);
        commit('setCurrentSurvey', data);
      } catch (error) {
        throw error;
      } finally {
        commit('setCurrentSurveyLoading', false);
      }
    },
    async saveSurvey({ commit }, survey) {
      try {
        const formData = new FormData();
    
        formData.append('title', survey.title);
        formData.append('description', survey.description);
        formData.append('expireDate', survey.expire_date);
        formData.append('isActive', survey.status);
        formData.append('questions', JSON.stringify(survey.questions));
    
        if (survey.image) {
          formData.append('image', survey.image);
        }
    
        let response = await axiosClient.post('/survey/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log(response);
        commit('setCurrentSurvey', response.data);
        return response;
      } catch (error) {
        console.error('Error saving survey:', error);
        throw error;
      }
    },
    async updateSurvey({ commit }, survey) {
      try {
        const formData = new FormData();
    
        formData.append('title', survey.title);
        formData.append('description', survey.description);
        formData.append('expireDate', survey.expireDate);
        formData.append('isActive', survey.status);
        formData.append('questions', JSON.stringify(survey.questions));
    
        if (survey.image) {
          formData.append('image', survey.image);
        }
    
        let response = await axiosClient.put(`/survey/${survey._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        // console.log(response);
        commit('setCurrentSurvey', response.data);
        return response;
      } catch (error) {
        console.error('Error update survey:', error);
        throw error;
      }
    },
    async deleteSurvey({ dispatch }, id) {
      try {
        await axiosClient.delete(`/survey/${id}`);
        await dispatch('getSurveys');
      } catch (error) {
        throw error;
      }
    },
    async saveSurveyAnswer({ commit }, { surveyId, answers }) {
      // console.log(surveyId, answers);
      try {
       const response =  await axiosClient.post(`/survey/response/${surveyId}`, { responses: answers });
       return response;
      } catch (error) {
        throw error;
      }
    },
  },

  mutations: {
    logout(state) {
      state.user.token = null;
      state.user.data = {};
      state.user.isAdmin = false;
      sessionStorage.removeItem('TOKEN');
    },
    setUser(state, user) {
      state.user.data = user;
      state.user.isAdmin = user.isAdmin;
    },
    setToken(state, token) {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },
    dashboardLoading(state, loading) {
      state.dashboard.loading = loading;
    },
    setDashboardData(state, data) {
      state.dashboard.data = data;
    },
    setSurveysLoading(state, loading) {
      state.surveys.loading = loading;
    },
    setSurveys(state, data) {
      state.surveys.data = data;
    },
    setCurrentSurveyLoading(state, loading) {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey(state, survey) {
      state.currentSurvey.data = survey;
    },
    notify(state, { message, type }) {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
  },

  modules: {},
});

export default store;
