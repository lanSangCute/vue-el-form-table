/* eslint-disable max-lines */
import debounce from "lodash.debounce";
import { generateFormItem } from "./generator";
import './time';

const noop = function() {};

export default {
    name: "lanjElForm",
    props: {
        configs: { type: Array | Function, default: () => [] },
        inline: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        labelWidth: { type: String | Number, default: "100px" },
        labelPosition: { type: String, default: "left" },
        initFormData: { type: Object },
        labelSuffix: { type: String, default: "" },
        col: { type: Number, default: 4 },
        formItemClassName:{ type: String, default: "" },
    },
    data() {
        let formData = {},
            defaulteData = {
                updateFormSign: false,
                formDataSettingSign: false,
                itemDependonWatchMap: {},
                itemChangeToEmitWatchMap: {}
            };

        if (Array.isArray(this.configs)) {
            let initData = this.getInitFormData(this.configs);
            formData = Object.assign(initData, this.initFormData || {});

            this.$nextTick(() => {
                this.loadAsyncData();
            });

            return {
                ...defaulteData,
                formData,
                configData: [...this.configs]
            };
        }

        defaulteData.formDataSettingSign = true;

        this.configs()
            .then(result => {
                this.formData = result.formData;
                this.configData = result.configData;
                this.formDataSettingSign = false;
                this.$emit("setFormDataEnd");

                this.debounceUpdateFunction = debounce(
                    this.updateFunctionalConfig,
                    300
                );
                this.$nextTick(() => {
                    this.loadAsyncData();
                    this.updateUnWatchHandle = this.$watch(
                        "formData",
                        this.debounceUpdateFunction,
                        {
                            deep: true
                        }
                    );
                });
            })
            .catch(err => {
                console.log("form config init function err", err);

                this.formDataSettingSign = false;
                this.$emit("setFormDataEnd");
            });

        return {
            ...defaulteData,
            formData,
            configData: []
        };
    },
    watch: {
        configs(val, oldVal) {
            if (val === oldVal) {
                return;
            }
            if (val && typeof val !== "function") {
                this.configData = val;
                let initData = this.getInitFormData(val),
                    newInitData = {...initData}
                Object.keys(initData).forEach(key=>{
                    newInitData[key] = this.formData[key] || newInitData[key]
                })
                this.formData = Object.assign(initData, this.initFormData || newInitData || {});
                this.unWatchMap();
                this.$nextTick(() => {
                    this.loadAsyncData();
                });
            }
            // todo resetForm
        }
    },
    render(h) {
        let formItemList = [],
            rules = {},
            colDivSign = this.col >= 1 && this.inline === false;

        this.configData.map(item => {
            let formItem = null;

            if (item.required) {
                let requiredRule = {
                    required: true,
                    message: item.placeholder?item.placeholder
                        :item.label
                        ? `请${item.type === "select" || item.type === "string" ? "选择" : "输入"}${
                            item.label
                        }`:'必填项,请填写或选择',
                        // : item.placeholder,
                    trigger:
                        item.type === "cascader"
                            ? ["blur", "change"]
                            : item.type === "editor"
                                ? "change"
                                : "blur"
                };

                if (rules[item.key]) {
                    rules[item.key].push(requiredRule);
                } else {
                    rules[item.key] = [requiredRule];
                }
            }

            if (item.rules) {
                rules[item.key] = item.rules.concat(rules[item.key] || []);
            }

            if (item.type === "empty") {
                formItem = <span>&nbsp;</span>;
            } else if (item.type === "string") {
                formItem = <span>{this.formData[item.key]}</span>;
            } else if (item.type === "render" && item.render) {
                formItem = item.render(
                    h,
                    this,
                    item,
                    this.formData[item.key],
                    data => {
                        this.formData[item.key] = data;
                    }
                );
            } else {
                formItem = generateFormItem(h, this, item);
            }
            formItem = (
                <el-form-item
                    key={item.key}
                    label={item.label}
                    prop={item.key}
                    class={`el-item-w-100 ${this.formItemClassName} ${item.className}`}
                    // class={"el-item-w-100 " + item.className}
                    {...{
                        props: {
                            ...(item.noLabel ? { "label-width": "0px" } : {}),
                            ...item.itemProps
                        }
                    }}
                >
                    {formItem}
                </el-form-item>
            );

            if (colDivSign) {
                formItem = (
                    <el-col
                        span={
                            item.fullLine
                                ? 24
                                : Math.floor(24 / this.col) * (item.col || 1)
                        }
                        class="px-16"
                    >
                        {formItem}
                    </el-col>
                );
            }

            formItemList.push(formItem);
        });

        if (colDivSign) {
            formItemList = <el-row>{formItemList}</el-row>;
        }

        return (
            <el-form
                {...{
                    class: "", // ofxh
                    on: {
                        input: noop
                    },
                    props: {
                        model: this.formData,
                        rules: rules,
                        inline: this.inline,
                        disabled: this.disabled,
                        "label-position": this.labelPosition,
                        "label-width": this.labelWidth,
                        "label-suffix": this.labelSuffix,
                        "validate-on-rule-change": false
                    },
                    ref: "form",
                    key: "form"
                }}
            >
                {formItemList}
                {this.$slots.inline}
            </el-form>
        );
    },
    methods: {
        getInitFormData(configs) {
            configs = configs || this.configData;

            let formData = {};

            configs.map(config => {
                let defaultData = null;

                if (typeof config.default === "function") {
                    defaultData = config.default();
                } else if (typeof config.default !== "undefined") {
                    defaultData = config.default;
                }

                formData[config.key] = defaultData;
            });

            return formData;
        },
        async loadItemAsyncData(config, configIndex) {
            if (
                (config.type === "select" ||
                    config.type === "checkbox" ||
                    config.type === "allCheckbox" ||
                    config.type === "multiselect" ||
                    config.type === "cascader" ||
                    config.type === "radio" ||
                    config.type === "stringOptions") &&
                (typeof config.options === "function" ||
                    typeof config.backOptionFunction === "function")
            ) {
                let options = [];

                if (typeof config.options === "function") {
                    config.backOptionFunction = config.options;

                    options = await config.options(this.formData);
                } else {
                    options = await config.backOptionFunction(this.formData);
                }
                this.configData[configIndex].options = options;
            }
        },
        async loadAsyncData() {
            let configs = this.configData,
                processList = configs.map((config, configIndex) => {
                    if (config.dependon) {
                        const bindWatch = () => {
                                this.itemDependonWatchMap[
                                    config.key
                                ] = config.dependon.map(v => {
                                    return this.$watch(
                                        `formData.${v}`,
                                        itemWatchHandle
                                    );
                                });
                            },

                            itemWatchHandle = async () => {
                                this.formData[config.key] = null;

                                await this.loadItemAsyncData(config, configIndex);

                                let watchList =
                                this.itemDependonWatchMap[config.key] || [];

                                watchList.map(f => {
                                    f();
                                });

                                bindWatch();
                            };

                        bindWatch();
                    }

                    if (config.changeToEmit) {
                        this.itemChangeToEmitWatchMap[config.key] = this.$watch(
                            `formData.${config.key}`,
                            () => {
                                this.$emit("changeOut", {
                                    key: config.key,
                                    config,
                                    data: this.formData[config.key],
                                    formData: this.formData
                                });
                            }
                        );
                    }
                    return this.loadItemAsyncData(config, configIndex);
                });

            await Promise.all(processList);

            this.$forceUpdate();
        },
        updateFunctionalConfig() {
            if (typeof this.configs !== "function") {
                return;
            }

            if (this.updateUnWatchHandle) {
                this.updateUnWatchHandle();
                this.updateUnWatchHandle = null;
            }

            // if (this.updateFormSign) {
            //     this.updateFormSign = false;
            //     return;
            // }

            this.formDataSettingSign = true;

            this.configs({
                formData: this.formData,
                configData: this.configData
            })
                .then(result => {
                    if (!result.notChange) {
                        this.formData = result.formData;
                        this.configData = result.configData;

                        this.updateFormSign = true;
                    }

                    this.$nextTick(() => {
                        this.updateUnWatchHandle = this.$watch(
                            "formData",
                            this.debounceUpdateFunction,
                            {
                                deep: true
                            }
                        );

                        this.$nextTick(() => {
                            this.loadAsyncData();
                            console.log("watching out formData", this.formData);
                        });

                        this.formDataSettingSign = false;
                        this.$emit("setFormDataEnd");
                    });
                })
                .catch(err => {
                    console.log("form config function err", err);

                    this.updateUnWatchHandle = this.$watch(
                        "formData",
                        this.debounceUpdateFunction,
                        {
                            deep: true
                        }
                    );

                    this.formDataSettingSign = false;
                    this.$emit("setFormDataEnd");
                });
        },
        setFormData(formData) {
            if (this.formDataSettingSign) {
                this.$once("setFormDataEnd", () => {
                    this.formData = { ...this.formData, ...formData };
                });
                return;
            }

            this.formData = { ...this.formData, ...formData };
        },
        validate() {
            return this.$refs.form.validate(...arguments);
        },
        resetFields() {
            this.$refs.form.resetFields();

            this.formData = this.getInitFormData();
        },
        unWatchMap() {
            [this.itemDependonWatchMap, this.itemChangeToEmitWatchMap].map(
                map => {
                    Object.keys(map).map(key => {
                        if (map[key] && typeof map[key] === "function") {
                            map[key]();
                        }
                    });
                }
            );
        },
        // 处理表单数据
        getHandleFormData(){
            let formData = {...this.formData};
            (this.configData || []).map(item => {
                const key = item.key;

                if (typeof formData[key] === "string") {
                    formData[key] = formData[key] && formData[key].trim();
                }

                let timeFormat =
                    item.timeFormat ||
                    (item.type === "datetimerange" || item.type === 'datetime'
                        ? "yyyy-MM-dd hh:mm:ss"
                        : "yyyy-MM-dd");

                try{
                    if (
                        formData[key] &&
                        (item.type === "daterange" ||
                            item.type === "datetimerange") &&
                        item.keyRange
                    ) {
                        formData[item.keyRange[0]] = typeof formData[key][0] !== 'string'?formData[key][0].currentFormat(
                            timeFormat
                        ):formData[key][0];
                        formData[item.keyRange[1]] = typeof formData[key][1] !== 'string'?formData[key][1].currentFormat(
                            timeFormat
                        ):formData[key][1];
                        formData[key] = [formData[item.keyRange[0]],formData[item.keyRange[1]]]
                        // delete formData[key];
                    }
                    if(formData[key] && (item.type === "date" || item.type === "datetime")){
                        formData[key] =typeof formData[key] !== 'string'?(formData[key]).currentFormat(
                            timeFormat
                        ):formData[key];
                    }
                }catch(e){
                    console.error(e);
                }
            });
            return formData;
        },
    },
    destroyed() {
        if (this.updateUnWatchHandle) {
            this.updateUnWatchHandle();
        }
        this.unWatchMap();
        // [this.itemDependonWatchMap, this.itemChangeToEmitWatchMap].map(
        //     map => {
        //         Object.keys(map).map(key => {
        //             if (map[key] && typeof map[key] === "function") {
        //                 map[key]();
        //             }
        //         });
        //     }
        // );
    }
};
