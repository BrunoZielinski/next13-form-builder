import { TextFieldFormElement } from '@/components/fields/text-field'
import { DateFieldFormElement } from '@/components/fields/date-field'
import { TitleFIeldFormElement } from '@/components/fields/title-field'
import { SpacerFieldFormElement } from '@/components/fields/spacer-field'
import { NumberFieldFormElement } from '@/components/fields/number-field'
import { SelectFieldFormElement } from '@/components/fields/select-field'
import { CheckboxFieldFormElement } from '@/components/fields/checkbox-field'
import { SubTitleFieldFormElement } from '@/components/fields/subtitle-field'
import { TextAreaFieldFormElement } from '@/components/fields/textarea-field'
import { ParagraphFieldFormElement } from '@/components/fields/paragraph-field'
import { SeparatorFieldFormElement } from '@/components/fields/separator-field'

export type ElementsType =
  | 'TextField'
  | 'DateField'
  | 'TitleFIeld'
  | 'SpacerField'
  | 'NumberField'
  | 'SelectField'
  | 'CheckboxField'
  | 'SubTitleField'
  | 'TextAreaField'
  | 'ParagraphField'
  | 'SeparatorField'

export type SubmitFunction = (key: string, value: string) => void

export type FormElement = {
  type: ElementsType
  validate: (formElement: FormElementInstance, currentValue: string) => boolean
  formComponent: React.FC<{
    isInvalid?: boolean
    defaultValue?: string
    elementInstance: FormElementInstance
    submitValue?: (key: string, value: string) => void
  }>
  construct: (id: string) => FormElementInstance
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
  designerComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
  designerButtonElement: {
    label: string
    icon: React.ElementType
  }
}

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, any>
}

type FormElements = {
  [key in ElementsType]: FormElement
}

export const FormElements: FormElements = {
  TextField: TextFieldFormElement,
  DateField: DateFieldFormElement,
  TitleFIeld: TitleFIeldFormElement,
  SpacerField: SpacerFieldFormElement,
  SelectField: SelectFieldFormElement,
  NumberField: NumberFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
}
