import Cookies from 'js-cookie';

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium',
    template_id: 0
};

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1);
        } else {
            Cookies.set('sidebarStatus', 0);
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0);
        state.sidebar.opened = false;
        state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device;
    },
    SET_SIZE: (state, size) => {
        state.size = size;
        Cookies.set('size', size);
    },
    // SET_TEMPLATE_ID: (state, id) => {
    //     state.template_id = id;
    // },
    SET_TEMPLATE_ID: (id) => {
        state.template_id = id;
    }
};

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR');
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device);
    },
    setSize({ commit }, size) {
        commit('SET_SIZE', size);
    },
    setTemplateId({ commit }, size) {
        commit('SET_TEMPLATE_ID', size);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
