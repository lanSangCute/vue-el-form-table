import ScheduleComponent from "./components/schedule/schedule.vue";
export const ScheduleModule = {
    install: function (vue) {
        const v = window.Vue || vue;
        v.component("lanj-form", ScheduleComponent);
    }
};
//# sourceMappingURL=index.js.map