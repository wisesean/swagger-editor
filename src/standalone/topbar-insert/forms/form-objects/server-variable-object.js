import { fromJS } from "immutable"

const enumFormItem = (j, updateForm, path) => fromJS({
  name: "枚举值",
  description: "可能变量值枚举中的值。",
  isRequired: false,
  hasErrors: false,
  value: "",
  updateForm: newForm => updateForm(newForm, path.concat(["value", j]))
})

const serverVariableFormItem = (i, updateForm, path) => fromJS({ 
  isRequired: true,
  name: "变量名",
  keyValue: "",
  description: "服务器变量的变量名。",
  value: {
    default: {
      value: "",
      isRequired: true,
      name: "默认",
      description: "必填。用于替换和发送的默认值（如果未提供备用值）。与架构对象的默认值不同，此值必须由使用者提供。",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "default"]))
    },
    enum: {
      value: [enumFormItem(0, updateForm, path.concat(["value", i, "value", "enum"]))],
      name: "枚举",
      defaultItem: j => enumFormItem(j, updateForm, path.concat(["value", i, "value", "enum"])),
      description: "如果替换选项来自有限的集合，则要使用的字符串值的枚举。",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "enum"]))
    },
    vardescription: {
      value: "",
      name: "描述",
      description: "标记的简短说明。通用标记语法可用于富文本表示。",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "vardescription"]))
    }
  },
  updateForm: newForm => updateForm(newForm, path.concat(["value", i]))
})

export const serverVariableForm = (updateForm, path) =>
  fromJS({
    value: [],
    name: "服务器变量",
    description: "变量名称与其值之间的映射。该值用于在服务器的 URL 模板中进行替换。",
    updateForm: newForm => updateForm(newForm, path),
    defaultItem: i => serverVariableFormItem(i, updateForm, path)
  })

export const serverVariableObject = (formData) => {
  const variables = formData.get("value")
  const newVariables = {}

  variables.forEach((variable) => {      
    const varName = variable.getIn(["keyValue"])      
    const varValue = variable.getIn(["value"])

    const enumVal = varValue.getIn(["enum", "value"])
    const enumValues = []

    if (enumVal) {
      enumVal.forEach((option) => {
        enumValues.push(option.get("value"))
      })
    }

    const newVariable = {
      default: varValue.getIn(["default", "value"]),
      enum: enumValues,
      description: varValue.getIn(["vardescription", "value"])
    }

    newVariables[varName] = newVariable
  })

  return newVariables
}
