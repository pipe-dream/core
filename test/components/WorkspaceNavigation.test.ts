import {mount} from '@vue/test-utils'
import {createLocalVue} from '@vue/test-utils'
import * as Vuex from 'vuex'
//@ts-ignore
import WorkspaceNavigation from '../../src/components/WorkspaceNavigation.vue';
import {PipeDream} from '../../src';
import {cloneDeep} from 'lodash';

describe('WorkspaceNavigation component', () => {

    const appCtx = new PipeDream({
        fileFactories: [],
    });
    const localVue = createLocalVue();
    localVue.use(Vuex);
    let store;
    let wrapper;
    let vm;

    beforeEach(() => {
        // Create new vm and mount for each test to make sure it is clean.
        store = new Vuex.Store(cloneDeep(appCtx.defaultStore));
        wrapper = mount(WorkspaceNavigation, {store, localVue});
        vm = wrapper.vm;
    });

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('have 3 available tabs', () => {
        expect(vm.$data.availableTabs)
            .toEqual(['Design', 'Review', 'Build']);

        expect(wrapper.findAll('div').length)
            .toBe(3);
    });

    test('default active tab is "Design"', () => {
        expect(vm.$data.activeTab)
            .toBe('Design');
    });

    test('can navigate between tabs', () => {
        const tabMenu = wrapper.findAll('div');

        tabMenu.at(2)
            .trigger('click');
        expect(vm.$data.activeTab)
            .toBe('Build');
        expect(store.state.navigation['workspace'])
            .toBe('Build');

        tabMenu.at(1)
            .trigger('click');
        expect(vm.$data.activeTab)
            .toBe('Review');
        expect(store.state.navigation['workspace'])
            .toBe('Review');
    });
    /*
    test('will style button container differently for active tab', () => {
        expect(vm.styleButtonContainer('Design'))
            .toBe('flex-1 -mb-px mr-1');

        expect(vm.styleButtonContainer('Review'))
            .toBe('flex-1 mr-1');
    });

    test('will style tab differently for active tab', () => {
        expect(vm.styleButton('Design'))
            .toBe('py-4 w-full text-center flex-1 inline-block font-semibold cursor-pointer bg-white border-l border-t border-r py-2 px-4 text-blue');

        expect(vm.styleButton('Review'))
            .toBe('py-4 w-full text-center flex-1 inline-block font-semibold cursor-pointer py-2 px-4 hover:text-blue-800 bg-gray-100 text-gray-800');
    });
    */
});
