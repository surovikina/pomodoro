import './header.less';
import {EventBus} from "../../share/event-bus";
import {events} from "../../share/constants";

const template = require('./header.handlebars');

export class Header {
    constructor() {
        this.init();
    }

    render() {
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = template();

        window.addEventListener('scroll', this.toggleClassOnScroll.bind(document.querySelector('.header'), 30));

        this.attachListeners()
    }

    toggleClassOnScroll(pxAmount) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (scrollTop > pxAmount) {
            document.querySelector('.header').classList.add('is-fixed');
            document.querySelector('.wrapper').style = 'margin-top: 106px';
        } else {
            document.querySelector('.header').classList.remove('is-fixed');
            document.querySelector('.wrapper').style = ' ';
        }
    }

    attachListeners() {
        document.querySelector('.header').addEventListener('click', function (event) {
            const target = event.target;

            if (target.parentElement.tagName === 'A') {
                event.preventDefault();

                const navLinks = document.querySelectorAll('.nav__link span');
                navLinks.forEach(link => link.classList.remove('is-active'));
                target.classList.add('is-active');
            }

            if (target.parentElement.tagName === 'A' && target.classList.contains('icon-list') || target.classList.contains('icon-trash')) {
                document.querySelector('a[data-link=trash]').classList.remove('hidden')
            } else if (target.parentElement.tagName === 'A') {
                document.querySelector('a[data-link=trash]').classList.add('hidden');
                document.querySelector('.nav__item-notification').classList.add('hidden');
            }

            if (target.parentElement.tagName === 'A' && target.classList.contains('icon-trash')) {
                EventBus.publish(events.REMOVE_MODE_CLICK);
            }

            if (target.parentElement.tagName === 'A'
                && target.classList.contains('icon-trash')
                && target.parentElement.nextElementSibling.classList.contains('nav__item-notification')
                && !target.parentElement.nextElementSibling.classList.contains('hidden')
                || !target.classList.contains('hidden')
                && target.classList.contains('nav__item-notification')) {
                EventBus.publish(events.DELETE_TASKS_CLICK);
            }
        });

        window.addEventListener('popstate', event => {
            if (event.state) {
                document.querySelectorAll('.nav__link span').forEach(link => link.classList.remove('is-active'));
                document.querySelector("[data-link=" + window.location.pathname.slice(1) + "] span").classList.add('is-active');
            }
        });
    }

    subscribeToEvents() {
        EventBus.subscribe(events.TASK_READY_TO_DELETE_CLICK, () => {
            document.querySelector('.nav__item-notification').classList.remove('hidden')
        });

        EventBus.subscribe(events.REMOVE_BUTTON_POPUP_CLICK, () => {
            document.querySelector('.icon-trash').classList.remove('is-active');
            document.querySelector('.icon-list').classList.add('active');
        })
    }

    init() {
        this.subscribeToEvents()
    }
}