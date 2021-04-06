/* eslint-disable max-lines */
const formTypeGeneratorMap = {
    // editor: {
    //     generate(h, item, value, changeHandle, vueAttrs) {
    //         if (item.disabled || (this.disabled && item.disabled !== false)) {
    //             return (
    //                 <div class="contain-content" domPropsInnerHTML={value} />
    //             );
    //         }
    //         // isReadOnly
    //         return (
    //             <com-ocj-editor
    //                 {...vueAttrs}
    //                 value={value}
    //                 on-input={changeHandle}
    //                 upload={item.upload}
    //                 class="mb-4"
    //             />
    //         );
    //     }
    // },
    stringOptions: {
        generate(h, item, value, changeHandle, vueAttrs) {
            if (typeof item.options === "function") {
                return <span />;
            }
            let showValue = value;
            if (Array.isArray(item.options) && item.options.length) {
                let tempList = item.options.filter((v, i) => {
                    if (typeof v === "object") {
                        return v.value === value || v.key === value;
                    }
                    if (i === Number(value)) {
                        return true;
                    }
                });
                if (tempList && tempList.length) {
                    showValue = tempList[0].label || tempList[0];
                } else if (item.getShowValueHandle) {
                    showValue = item.getShowValueHandle({
                        options: item.options,
                        value: value
                    });
                }
            } else if (typeof item.options === "object") {
                if (item.options[value]) {
                    showValue = item.options[value];
                }
            }
            return <span>{showValue}</span>;
        }
    },
    input: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-input
                    {...vueAttrs}
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    inputNumber: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-input-number
                    {...vueAttrs}
                    class="w-100"
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    select: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-select
                    clearable={true}
                    {...vueAttrs}
                    class="w-100"
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                >
                    {item.optionsPrefixSlot}
                    {(Array.isArray(item.options) ? item.options : []).map(
                        option => {
                            return (
                                <el-option
                                    key={option.key || option.value || ""}
                                    label={option.label}
                                    value={option.key || option.value || ""}
                                />
                            );
                        }
                    )}
                    {item.optionsPostfixSlot}
                </el-select>
            );
        }
    },
    textarea: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-input
                    {...vueAttrs}
                    type="textarea"
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                    resize={item.resize}
                    rows={item.rows}
                />
            );
        }
    },
    radio: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-radio-group
                    {...vueAttrs}
                    value={value}
                    on-input={changeHandle}
                    disabled={item.disabled}
                >
                    {(Array.isArray(item.options) ? item.options : []).map(
                        option => {
                            return (
                                <el-radio
                                    label={option.key || option.value || 0}
                                    key={option.key || option.value || 0}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                    {option.tip}
                                </el-radio>
                            );
                        }
                    )}
                </el-radio-group>
            );
        }
    },
    date: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-date-picker
                    {...vueAttrs}
                    class="w-100"
                    value={value}
                    on-input={changeHandle}
                    type="date"
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    time: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-time-picker
                    {...vueAttrs}
                    class="w-100"
                    picker-options={item.pickerOptioins || {}}
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    datetime: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-date-picker
                    {...vueAttrs}
                    class="w-100"
                    type="datetime"
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    daterange: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-date-picker
                    {...vueAttrs}
                    class="w-100"
                    style={{ width: "100%" }}
                    value={value}
                    on-input={changeHandle}
                    unlink-panels={true}
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled={item.disabled}
                />
            );
        }
    },
    datetimerange: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-date-picker
                    {...vueAttrs}
                    class="w-100"
                    style={{ width: "100%" }}
                    value={value}
                    on-input={changeHandle}
                    unlink-panels={true}
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled={item.disabled}
                    default-time={
                        item["default-time"] || ["00:00:00", "23:59:59"]
                    }
                />
            );
        }
    },
    multiselect: {
        generate(h, item, value, changeHandle, vueAttrs) {
            const selectAll = () => {
                    if (!Array.isArray(item.options)) {
                        return;
                    }
                    let allKey = (item.options || []).map(v => v.key || v.value);
                    changeHandle(allKey);
                },

                deSelectAll = () => {
                    changeHandle([]);
                };

            return (
                <el-select
                    {...vueAttrs}
                    class={`w-100`}
                    value={value}
                    on-input={changeHandle}
                    multiple
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                >
                    {item.selectPrefixSlot ? (
                        <template slot="prefix">
                            {item.selectPrefixSlot}
                        </template>
                    ) : null}
                    {item.optionsPrefixSlot ? (
                        item.optionsPrefixSlot
                    ) : item.showSelectAll ? (
                        <div
                            class="px-20 py-8"
                            style={`
                                position: sticky;
                                top: 0;
                                background-color: rgb(255, 255, 255);
                                z-index: 1;
                                margin-right: 0;
                                margin-top: -6px;
                            `}
                        >
                            <span class="blue-text-button" on-click={selectAll}>
                                全选
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span
                                class="blue-text-button"
                                on-click={deSelectAll}
                            >
                                全不选
                            </span>
                        </div>
                    ) : null}
                    {(Array.isArray(item.options) ? item.options : []).map(
                        option => {
                            return (
                                <el-option
                                    key={option.key || option.value}
                                    label={option.label}
                                    value={option.key || option.value}
                                />
                            );
                        }
                    )}
                </el-select>
            );
        }
    },
    checkbox: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-checkbox-group
                    {...vueAttrs}
                    value={value || []}
                    on-input={changeHandle}
                    disabled={item.disabled}
                >
                    {(Array.isArray(item.options) ? item.options : []).map(
                        option => {
                            return (
                                <el-checkbox
                                    label={option.key || option.value}
                                    key={option.key || option.value}
                                    value={option.key || option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </el-checkbox>
                            );
                        }
                    )}
                </el-checkbox-group>
            );
        }
    },
    // 包含全选按钮的多选框
    allCheckbox: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <com-allCheckbox
                    {...vueAttrs}
                    value={value || []}
                    on-input={changeHandle}
                    options={item.options}
                />
            );
        }
    },
    cascader: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <el-cascader
                    {...vueAttrs}
                    class="w-100"
                    options={
                        typeof item.options === "function" ? [] : item.options
                    }
                    value={value}
                    on-input={changeHandle}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                />
            );
        }
    },
    switch: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return [
                <el-switch
                    {...vueAttrs}
                    value={value}
                    on-input={changeHandle}
                    active-color="#13ce66"
                    disabled={item.disabled}
                />,
                item.options ? (
                    <span style="padding: 0 0 0 10px;font-size: 13px;vertical-align: bottom;">
                        {(item.props && item.props.activeValue
                            ? value === item.props.activeValue
                            : value)
                            ? item.options[1]
                            : item.options[0]}
                    </span>
                ) : null
            ];
        }
    },
    stringrange: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <com-stringRange
                    {...vueAttrs}
                    value={value}
                    on-input={changeHandle}
                    disabled={item.disabled}
                />
            );
        }
    },
    tableTransfer: {
        generate(h, item, value, changeHandle, vueAttrs) {
            return (
                <com-tableTransfer
                    {...vueAttrs}
                    value={value}
                    on-input={changeHandle}
                    disabled={item.disabled}
                />
            );
        }
    }
};

export function generateFormItem(h, vm, item, options) {
    let formItem = null,
        vueAttrs = {},
        itemType = item.type || "input",
        formTypeGenerator = formTypeGeneratorMap[itemType],
        getBindValueHandle =
            options && options.getBindValueHandle
                ? options.getBindValueHandle
                : null,
        bindValueChangeHandle =
            options && options.getBindValueChangeHandle
                ? options.getBindValueChangeHandle()
                : null;

    if (!formTypeGenerator) {
        return null;
    }

    if (item.unionKey) {
        vueAttrs.key = item.unionKey;
    }

    [
        "props",
        "on",
        "directives",
        "scopedSlots",
        "slot",
        "class",
        "attrs",
        "domProps",
        "nativeOn",
        "style"
    ].map(key => {
        if (item[key]) {
            vueAttrs[key] = item[key];
        }
    });

    formItem = formTypeGenerator.generate.call(
        vm,
        h,
        item,
        getBindValueHandle ? getBindValueHandle() : vm.formData[item.key],
        value => {
            return bindValueChangeHandle
                ? bindValueChangeHandle(value)
                : (vm.formData[item.key] = value);
        },
        vueAttrs
    );

    return formItem;
}
