<script>
export default {
    name: "functionRender",
    functional: true,
    props: {
        data: Object,
        render: Function
    },
    render: (h, ctx) => {
        const params = {
            data: ctx.props.data
        };
        return ctx.props.render(h, params);
    }
};
</script>
