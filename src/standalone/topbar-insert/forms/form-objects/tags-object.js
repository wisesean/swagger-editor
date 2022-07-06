import { fromJS } from "immutable"
import { tagObject, tagForm } from "./tag-object"

export const tagsForm = (updateForm, path) =>
  fromJS({
    tags: {
      value: [tagForm(updateForm, path.concat(["tags", "value", 0]))],
      name: "标签声明",
      description: "具有其他元数据的规范使用的标记列表。标签的顺序可用于通过解析工具反映其顺序。并非必须声明操作对象使用的所有标记。未声明的标记可以随机组织或基于工具的逻辑进行组织。列表中的每个标签名称必须是唯一的。",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagForm(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const tagsObject = (formData) => {
  const tags = formData.getIn(["tags", "value"])
  const tagsObject = []

  tags.forEach((tag) => {
    const newTag = tagObject(tag)
    tagsObject.push(newTag)
  })

  return tagsObject
}