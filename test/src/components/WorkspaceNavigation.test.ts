import {mount} from '@vue/test-utils'
import {createLocalVue} from '@vue/test-utils'
import * as Vuex from 'vuex'
//@ts-ignore
import WorkspaceNavigation from '../../../src/components/WorkspaceNavigation.vue';
import {PipeDream} from '../../../src';
import {cloneDeep} from 'lodash';

describe('WorkspaceNavigation component', () => {

    // masterFileFactory: options.fileFactories[0] does not allow for empty fileFactories array
    test('avoid-warning', () => {
        expect(true).toBeTruthy();
    })


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

        expect(wrapper.findAll('a').length)
            .toBe(3);
    });

    test('default active tab is "Design"', () => {
        expect(vm.$data.activeTab)
            .toBe('Design');
    });

    test('can navigate between tabs', () => {
        const tabMenu = wrapper.findAll('a');

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

    test('will style button container differently for active tab', () => {
        expect(vm.styleButtonContainer('Design'))
            .toContain('flex-1 -mb-px mr-1');

        expect(vm.styleButtonContainer('Review'))
            .toContain('flex-1 mr-1');
    });

    test('will style tab differently for active tab', () => {
        // Only classes that are not for cosmetics
        let mandatoryClasses = [
            'py-2',
            'w-full',
            'text-center',
            'flex-1',
            'inline-block',
            'px-4'
        ]
        let hits = mandatoryClasses.filter(x => vm.styleButton('Design').indexOf(x)>1).length
        expect(hits).toBe(mandatoryClasses.length)

        // Only classes that are not for cosmetics
        mandatoryClasses = [
            'py-2',
            'w-full',
            'text-center',
            'flex-1',
            'inline-block',
            'px-4',
            'hover:'
        ]
        hits = mandatoryClasses.filter(x => vm.styleButton('Review').indexOf(x)>1).length
        expect(hits).toBe(mandatoryClasses.length);
    });

});
