<script setup>
import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String,
        default: 'indigo',
    },
    to: [Object, String],
    href: String,
    link: {
        type: Boolean,
        default: false,
    },
    circle: {
        type: Boolean,
        default: false,
    },
});

const computedClasses = computed(() => {
    const baseClasses = [
        'flex',
        'text-sm',
        'border',
        'border-2',
        'border-transparent',
    ];

    const colorClasses = {
        indigo: {
            link: ['text-indigo-500', 'focus:border-indigo-500'],
            default: ['bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-500'],
        },
        red: {
            link: ['text-red-500', 'focus:border-red-500'],
            default: ['bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500'],
        },
        green: {
            link: ['text-green-500', 'focus:border-green-500'],
            default: ['bg-emerald-500', 'hover:bg-emerald-600', 'focus:ring-emerald-400'],
        },
    };

    let additionalClasses = [];

    if (props.link) {
        additionalClasses = colorClasses[props.color]?.link || [];
    } else {
        additionalClasses = [
            'text-white',
            'focus:ring-2',
            'focus:ring-offset-2',
            ...(colorClasses[props.color]?.default || []),
        ];
    }

    if (props.circle) {
        additionalClasses = [
            ...additionalClasses,
            'h-8',
            'w-8',
            'items-center',
            'justify-center',
            'rounded-full',
            'text-sm',
        ];
    } else {
        additionalClasses = [
            ...additionalClasses,
            'p-0',
            'py-2',
            'px-4',
            'rounded-md',
        ];
    }

    return [...baseClasses, ...additionalClasses];
});
</script>

<template>
    <a v-if="href" :href="href" :class="computedClasses">
        <slot></slot>
    </a>

    <router-link v-else-if="props.to" :to="props.to" :class="computedClasses">
        <slot></slot>
    </router-link>
    
    <button v-else :class="computedClasses">
        <slot></slot>
    </button>
</template>