import type { Schema, Attribute } from '@strapi/strapi';

export interface DietDietComponent extends Schema.Component {
  collectionName: 'components_diet_diet_components';
  info: {
    displayName: 'DietComponent';
    description: '';
  };
  attributes: {
    Day: Attribute.Enumeration<
      [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]
    > &
      Attribute.Required;
    Breakfast: Attribute.Component<'diet.diet-foods', true>;
    Lunch: Attribute.Component<'diet.diet-foods', true>;
    Dinner: Attribute.Component<'diet.diet-foods', true>;
  };
}

export interface DietDietFoods extends Schema.Component {
  collectionName: 'components_diet_diet_foods';
  info: {
    displayName: 'dietFoods';
  };
  attributes: {
    food: Attribute.Relation<
      'diet.diet-foods',
      'oneToMany',
      'api::food-db.food-db'
    >;
    description: Attribute.Text;
  };
}

export interface FormFieldTypeBooleanQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_boolean_questions';
  info: {
    displayName: 'BooleanQuestion';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<['boolean']> &
      Attribute.Required &
      Attribute.DefaultTo<'boolean'>;
    initialValue: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    controlType: Attribute.Enumeration<['switch']> &
      Attribute.Required &
      Attribute.DefaultTo<'switch'>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
  };
}

export interface FormFieldTypeChoiceOptions extends Schema.Component {
  collectionName: 'components_form_field_type_choice_options';
  info: {
    displayName: 'ChoiceOptions';
    description: '';
  };
  attributes: {
    display: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
    isDefault: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface FormFieldTypeChoiceQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_choice_questions';
  info: {
    displayName: 'ChoiceQuestion';
    description: '';
  };
  attributes: {
    controlType: Attribute.Enumeration<['dropDown', 'checkBox']> &
      Attribute.Required;
    options: Attribute.Component<'form-field-type.choice-options', true> &
      Attribute.Required;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['choice']> &
      Attribute.Required &
      Attribute.DefaultTo<'choice'>;
  };
}

export interface FormFieldTypeDateQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_date_questions';
  info: {
    displayName: 'DateQuestion';
  };
  attributes: {
    initialValue: Attribute.Date;
    startDate: Attribute.Date;
    endDate: Attribute.Date;
    dateFormat: Attribute.Enumeration<['dd/MM/yyyy']> &
      Attribute.Required &
      Attribute.DefaultTo<'dd/MM/yyyy'>;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['date']> &
      Attribute.Required &
      Attribute.DefaultTo<'date'>;
  };
}

export interface FormFieldTypeDateTimeQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_date_time_questions';
  info: {
    displayName: 'DateTimeQuestion';
  };
  attributes: {
    initialValue: Attribute.DateTime;
    startDateTime: Attribute.DateTime;
    endDateTime: Attribute.DateTime;
    dateTimeFormat: Attribute.Enumeration<['MM/dd/yy HH:mm:ss ZZZZ']> &
      Attribute.Required &
      Attribute.DefaultTo<'MM/dd/yy HH:mm:ss ZZZZ'>;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['dateTime']> &
      Attribute.Required &
      Attribute.DefaultTo<'dateTime'>;
  };
}

export interface FormFieldTypeDecimalQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_decimal_questions';
  info: {
    displayName: 'DecimalQuestion';
  };
  attributes: {
    defaultValue: Attribute.Decimal;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['decimal']> &
      Attribute.Required &
      Attribute.DefaultTo<'decimal'>;
  };
}

export interface FormFieldTypeFormValidation extends Schema.Component {
  collectionName: 'components_form_field_type_form_validations';
  info: {
    displayName: 'FormValidation';
    description: '';
  };
  attributes: {
    valueMsg: Attribute.Component<'form-field-type.validator-value-msg'> &
      Attribute.Required;
    type: Attribute.Enumeration<
      ['minValue', 'maxValue', 'regex', 'maxLength', 'minLength']
    >;
  };
}

export interface FormFieldTypeIntegerQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_integer_questions';
  info: {
    displayName: 'IntegerQuestion';
  };
  attributes: {
    defaultValue: Attribute.Integer;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['integer']> &
      Attribute.Required &
      Attribute.DefaultTo<'integer'>;
  };
}

export interface FormFieldTypeReferenceQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_reference_questions';
  info: {
    displayName: 'ReferenceQuestion';
    description: '';
  };
  attributes: {
    controlType: Attribute.Enumeration<['familyDropDown']> &
      Attribute.Required &
      Attribute.DefaultTo<'familyDropDown'>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    selectType: Attribute.Enumeration<['single', 'multiple']> &
      Attribute.Required &
      Attribute.DefaultTo<'single'>;
    type: Attribute.Enumeration<['reference']> &
      Attribute.Required &
      Attribute.DefaultTo<'reference'>;
  };
}

export interface FormFieldTypeStringQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_string_questions';
  info: {
    displayName: 'StringQuestion';
  };
  attributes: {
    initialValue: Attribute.String;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['string']> &
      Attribute.Required &
      Attribute.DefaultTo<'string'>;
  };
}

export interface FormFieldTypeTextQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_text_questions';
  info: {
    displayName: 'TextQuestion';
  };
  attributes: {
    initialValue: Attribute.Text;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['text']> &
      Attribute.Required &
      Attribute.DefaultTo<'text'>;
  };
}

export interface FormFieldTypeTimeQuestion extends Schema.Component {
  collectionName: 'components_form_field_type_time_questions';
  info: {
    displayName: 'TimeQuestion';
  };
  attributes: {
    initialValue: Attribute.Time;
    startTime: Attribute.Time;
    endTime: Attribute.Time;
    timeFormat: Attribute.Enumeration<['HH:mm:ss']> &
      Attribute.Required &
      Attribute.DefaultTo<'HH:mm:ss'>;
    validations: Attribute.Component<'form-field-type.form-validation', true>;
    formDetails: Attribute.Component<'service-components.product-form'> &
      Attribute.Required;
    type: Attribute.Enumeration<['time']> &
      Attribute.Required &
      Attribute.DefaultTo<'time'>;
  };
}

export interface FormFieldTypeValidatorValueMsg extends Schema.Component {
  collectionName: 'components_form_field_type_validator_value_msgs';
  info: {
    displayName: 'ValidatorValueMsg';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    message: Attribute.String & Attribute.Required;
  };
}

export interface FormFormAnswer extends Schema.Component {
  collectionName: 'components_form_form_answers';
  info: {
    displayName: 'formAnswer';
    description: '';
  };
  attributes: {
    valueInteger: Attribute.Integer;
    valueDecimal: Attribute.Decimal;
    valueString: Attribute.Text;
    valueText: Attribute.Text;
    valueBoolean: Attribute.Boolean;
    valueDate: Attribute.Date;
    valueTime: Attribute.Time;
    valueDatetime: Attribute.DateTime;
    hint: Attribute.String;
    questionId: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<
      [
        'choice',
        'reference',
        'integer',
        'decimal',
        'boolean',
        'date',
        'dateTime',
        'time',
        'string',
        'text'
      ]
    > &
      Attribute.Required;
    question: Attribute.String & Attribute.Required;
    valueReference: Attribute.String;
    valueChoice: Attribute.String;
  };
}

export interface MasterdataContactUs extends Schema.Component {
  collectionName: 'components_masterdata_contactuses';
  info: {
    displayName: 'contactUs';
  };
  attributes: {
    contactNumber: Attribute.BigInteger & Attribute.Required;
  };
}

export interface MasterdataEmergencyHelpline extends Schema.Component {
  collectionName: 'components_masterdata_emergency_helplines';
  info: {
    displayName: 'EmergencyHelpline';
  };
  attributes: {
    contactNumber: Attribute.BigInteger & Attribute.Required;
    label: Attribute.String;
    message: Attribute.Text;
  };
}

export interface MedicalEmergencyService extends Schema.Component {
  collectionName: 'components_medical_emergency_services';
  info: {
    displayName: 'emergencyService';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    contactPerson: Attribute.String & Attribute.Required;
    contactNumber: Attribute.String & Attribute.Required;
    preferredRank: Attribute.Integer & Attribute.DefaultTo<12>;
    ambulanceContact: Attribute.String;
    serviceType: Attribute.Enumeration<['Ambulance', 'Hospital']> &
      Attribute.DefaultTo<'Hospital'>;
    TypeOfSupport: Attribute.Enumeration<
      ['BLS - Basic Life Support', 'ALS - Advance Life Support']
    > &
      Attribute.DefaultTo<'BLS - Basic Life Support'>;
  };
}

export interface MedicalMedicine extends Schema.Component {
  collectionName: 'components_medical_medicines';
  info: {
    displayName: 'medicine';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    dose: Attribute.String & Attribute.Required;
    Dosage: Attribute.String & Attribute.Required;
    schedule: Attribute.String & Attribute.Required;
    Duration: Attribute.String & Attribute.Required;
    medicineType: Attribute.Enumeration<
      ['Homeopathy', 'Allopathy', 'Ayurvedic']
    > &
      Attribute.DefaultTo<'Allopathy'>;
  };
}

export interface MedicalPrescription extends Schema.Component {
  collectionName: 'components_medical_prescriptions';
  info: {
    displayName: 'Prescription';
    description: '';
  };
  attributes: {
    prescribedBy: Attribute.String;
    prescriptionDate: Attribute.Date;
    Medicine: Attribute.Component<'medical.medicine', true>;
    alternateMedicine: Attribute.Component<'medical.medicine', true>;
    media: Attribute.Media;
    doctorType: Attribute.Relation<
      'medical.prescription',
      'oneToOne',
      'api::doctor-specialization.doctor-specialization'
    >;
    publish: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface MedicalUserInsurance extends Schema.Component {
  collectionName: 'components_medical_user_insurances';
  info: {
    displayName: 'UserInsurance';
    description: '';
  };
  attributes: {
    insuranceProvider: Attribute.String & Attribute.Required;
    policyNumber: Attribute.String;
    contactPerson: Attribute.String & Attribute.Required;
    contactNumber: Attribute.String & Attribute.Required;
    expiryDate: Attribute.Date;
  };
}

export interface MobileUiAboutUs extends Schema.Component {
  collectionName: 'components_mobile_ui_about_uses';
  info: {
    displayName: 'about-us';
    description: '';
  };
  attributes: {
    header: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'About us'>;
    description: Attribute.Text & Attribute.Required;
    offering: Attribute.Component<'mobile-ui.sg-offerings'>;
    cta: Attribute.Component<'mobile-ui.button'>;
  };
}

export interface MobileUiBanner extends Schema.Component {
  collectionName: 'components_mobile_ui_banners';
  info: {
    displayName: 'banner';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    bannerImage: Attribute.Media & Attribute.Required;
    cta: Attribute.Component<'mobile-ui.link'>;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface MobileUiButton extends Schema.Component {
  collectionName: 'components_mobile_ui_buttons';
  info: {
    displayName: 'button';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    theme: Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Attribute.Required &
      Attribute.DefaultTo<'primary'>;
    link: Attribute.Component<'mobile-ui.link'>;
  };
}

export interface MobileUiLink extends Schema.Component {
  collectionName: 'components_mobile_ui_links';
  info: {
    displayName: 'link';
    description: '';
  };
  attributes: {
    href: Attribute.String & Attribute.Required;
    label: Attribute.String;
    isExternal: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    target: Attribute.Enumeration<['_self', '_parent', '_blank', '_top']> &
      Attribute.Required &
      Attribute.DefaultTo<'_blank'>;
    downloadLink: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface MobileUiNewsLetter extends Schema.Component {
  collectionName: 'components_mobile_ui_news_letters';
  info: {
    displayName: 'news-letter';
    description: '';
  };
  attributes: {
    title: Attribute.Text & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    newsletters: Attribute.Component<'mobile-ui.button', true>;
  };
}

export interface MobileUiSgOfferItem extends Schema.Component {
  collectionName: 'components_mobile_ui_sg_offer_items';
  info: {
    displayName: 'sg-offer-item';
  };
  attributes: {
    value: Attribute.Text & Attribute.Required;
  };
}

export interface MobileUiSgOffer extends Schema.Component {
  collectionName: 'components_mobile_ui_sg_offers';
  info: {
    displayName: 'sg-offer';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    values: Attribute.Component<'mobile-ui.sg-offer-item', true>;
  };
}

export interface MobileUiSgOfferings extends Schema.Component {
  collectionName: 'components_mobile_ui_sg_offerings';
  info: {
    displayName: 'sg-offerings';
    description: '';
  };
  attributes: {
    header: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'What we offer'>;
    offers: Attribute.Component<'mobile-ui.sg-offer', true>;
  };
}

export interface MobileUiTestimonials extends Schema.Component {
  collectionName: 'components_mobile_ui_testimonials';
  info: {
    displayName: 'testimonials';
  };
  attributes: {
    testimonials: Attribute.Relation<
      'mobile-ui.testimonials',
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    title: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Testimonials'>;
  };
}

export interface PriceDiscount extends Schema.Component {
  collectionName: 'components_price_discounts';
  info: {
    displayName: 'discount';
  };
  attributes: {
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    discountType: Attribute.Enumeration<['fixed', 'percentage']> &
      Attribute.Required &
      Attribute.DefaultTo<'fixed'>;
    value: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface PricePriceDetails extends Schema.Component {
  collectionName: 'components_price_price_details';
  info: {
    displayName: 'priceDetails';
    description: '';
  };
  attributes: {
    totalAmount: Attribute.Float & Attribute.Required;
    products: Attribute.Component<'price.product-price', true>;
    subTotal: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    taxes: Attribute.Component<'price.tax', true>;
    discounts: Attribute.Component<'price.discount', true>;
    totalTax: Attribute.Float & Attribute.Required & Attribute.DefaultTo<0>;
    totalDiscount: Attribute.Float &
      Attribute.Required &
      Attribute.DefaultTo<0>;
  };
}

export interface PriceProductPrice extends Schema.Component {
  collectionName: 'components_price_product_prices';
  info: {
    displayName: 'productPrice';
    description: '';
  };
  attributes: {
    productId: Attribute.String & Attribute.Required;
    displayName: Attribute.String & Attribute.Required;
    productName: Attribute.String;
    price: Attribute.Float;
    priceId: Attribute.String;
    quantity: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
  };
}

export interface PriceTax extends Schema.Component {
  collectionName: 'components_price_taxes';
  info: {
    displayName: 'Tax';
  };
  attributes: {
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    taxRate: Attribute.Decimal & Attribute.Required;
  };
}

export interface ServiceComponentsBanner extends Schema.Component {
  collectionName: 'components_service_components_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    bannerImage: Attribute.Media & Attribute.Required;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    cta: Attribute.Component<'mobile-ui.link'>;
  };
}

export interface ServiceComponentsContentPrice extends Schema.Component {
  collectionName: 'components_service_components_content_prices';
  info: {
    displayName: 'ContentPrice';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    amount: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    amountWithoutDiscount: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    discountPercentage: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 100;
        },
        number
      >;
    pricingType: Attribute.Enumeration<['oneTime', 'perHour']> &
      Attribute.Required;
    showInclusiveOfAllTaxes: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface ServiceComponentsFaq extends Schema.Component {
  collectionName: 'components_service_components_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    question: Attribute.String & Attribute.Required;
    answer: Attribute.Text & Attribute.Required;
  };
}

export interface ServiceComponentsMetadata extends Schema.Component {
  collectionName: 'components_service_components_metadata';
  info: {
    displayName: 'metadata';
  };
  attributes: {
    key: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
  };
}

export interface ServiceComponentsOfferings extends Schema.Component {
  collectionName: 'components_service_components_offerings';
  info: {
    displayName: 'Offerings';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    offerings: Attribute.Component<'service-components.steps', true>;
  };
}

export interface ServiceComponentsProductContent extends Schema.Component {
  collectionName: 'components_service_components_product_contents';
  info: {
    displayName: 'ProductSubscriptionContent';
    description: '';
  };
  attributes: {
    mainHeading: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    headingDescription: Attribute.Text;
    productImage: Attribute.Media & Attribute.Required;
    subHeading1: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
    subHeading1Description: Attribute.Text & Attribute.Required;
    FAQ: Attribute.Component<'service-components.faq', true>;
    showSinglesPlan: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    showCouplePlans: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    exploreCouplePlansHeading: Attribute.String;
    faqHeading: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'How It works?'>;
    exploreNowCTALabel: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Explore Now'>;
    benefitsHeading: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Service we provide'>;
  };
}

export interface ServiceComponentsProductForm extends Schema.Component {
  collectionName: 'components_service_components_product_forms';
  info: {
    displayName: 'ProductForm';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    required: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    requiredMsg: Attribute.String & Attribute.DefaultTo<'Required'>;
    placeholder: Attribute.String;
    hidden: Attribute.Boolean & Attribute.DefaultTo<false>;
    hint: Attribute.Enumeration<['pinCode', 'shiftDurationDays', 'quantity']>;
  };
}

export interface ServiceComponentsProductPriceRule extends Schema.Component {
  collectionName: 'components_service_components_product_price_rules';
  info: {
    displayName: 'ProductPriceRule';
    description: '';
  };
  attributes: {
    ruleType: Attribute.Enumeration<
      ['pincodeEquals', 'pincodeRange', 'hoursEq', 'default']
    > &
      Attribute.Required;
    value: Attribute.Text & Attribute.Required;
    label: Attribute.String & Attribute.Required;
  };
}

export interface ServiceComponentsProductPrice extends Schema.Component {
  collectionName: 'components_service_components_product_prices';
  info: {
    displayName: 'ProductPrice';
    description: '';
  };
  attributes: {
    rules: Attribute.Component<'service-components.product-price-rule', true>;
    unitAmount: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    label: Attribute.String;
    billingScheme: Attribute.Enumeration<['perUnit']>;
    pricingType: Attribute.Enumeration<['oneTime', 'recurring', 'contactUs']> &
      Attribute.Required;
    recurringInterval: Attribute.Enumeration<
      ['daily', 'weekly', 'monthly', 'yearly']
    >;
    recurringIntervalCount: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    recurringPlanId: Attribute.String;
    benefitApplicableToMembersLimit: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    discountPercentage: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 100;
        },
        number
      >;
    amountWithoutDiscount: Attribute.Decimal;
  };
}

export interface ServiceComponentsServiceData extends Schema.Component {
  collectionName: 'components_service_components_service_data';
  info: {
    displayName: 'ServiceData';
    description: '';
  };
  attributes: {
    key: Attribute.String & Attribute.Required;
    value: Attribute.Text & Attribute.Required;
    private: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['formData']> &
      Attribute.Required &
      Attribute.DefaultTo<'formData'>;
  };
}

export interface ServiceComponentsServiceDescription extends Schema.Component {
  collectionName: 'components_service_components_service_descriptions';
  info: {
    displayName: 'ServiceDescription';
    description: '';
  };
  attributes: {
    serviceImage: Attribute.Media & Attribute.Required;
    heading: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    headingAlignment: Attribute.Enumeration<['left', 'center', 'right']> &
      Attribute.Required &
      Attribute.DefaultTo<'left'>;
  };
}

export interface ServiceComponentsServiceEnquiry extends Schema.Component {
  collectionName: 'components_service_components_service_enquiries';
  info: {
    displayName: 'ServiceEnquiry';
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'For More enquires'>;
    contactTeam: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Contact SilverGenie team'>;
    ctaLabel: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'call now'>;
    enqiuryPhoneNumber: Attribute.String & Attribute.Required;
  };
}

export interface ServiceComponentsServiceFaq extends Schema.Component {
  collectionName: 'components_service_components_service_faqs';
  info: {
    displayName: 'ServiceFAQ';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    faq: Attribute.Component<'service-components.faq', true>;
  };
}

export interface ServiceComponentsServicePrice extends Schema.Component {
  collectionName: 'components_service_components_service_prices';
  info: {
    displayName: 'ServicePrice';
    description: '';
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    priceSuperscript: Attribute.String;
    priceDescription: Attribute.Text;
    startPrice: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    endPrice: Attribute.Float;
  };
}

export interface ServiceComponentsServiceWorkingSteps extends Schema.Component {
  collectionName: 'components_service_components_service_working_steps';
  info: {
    displayName: 'ServiceWorkingSteps';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    steps: Attribute.Component<'service-components.steps', true>;
  };
}

export interface ServiceComponentsSteps extends Schema.Component {
  collectionName: 'components_service_components_steps';
  info: {
    displayName: 'ValueArray';
    description: '';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
  };
}

export interface SystemFormField extends Schema.Component {
  collectionName: 'components_system_form_fields';
  info: {
    displayName: 'formField';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    type: Attribute.Enumeration<
      ['text', 'option', 'multiple-option', 'checkbox', 'date', 'time', 'media']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'text'>;
    placeholder: Attribute.String & Attribute.DefaultTo<'Your Answer'>;
    isRequired: Attribute.Boolean & Attribute.DefaultTo<false>;
    description: Attribute.RichText;
    options: Attribute.Text;
    name: Attribute.String;
  };
}

export interface UserContactsAddress extends Schema.Component {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'address';
    icon: 'house';
    description: '';
  };
  attributes: {
    state: Attribute.String & Attribute.Required;
    city: Attribute.String & Attribute.Required;
    streetAddress: Attribute.String & Attribute.Required;
    postalCode: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    country: Attribute.String &
      Attribute.Required &
      Attribute.CustomField<'plugin::country-select.country'>;
  };
}

export interface UserContactsContact extends Schema.Component {
  collectionName: 'components_address_contacts';
  info: {
    displayName: 'contact';
    description: '';
  };
  attributes: {
    phoneNumber: Attribute.String & Attribute.Required;
    contactPerson: Attribute.String & Attribute.Required;
  };
}

export interface UserContactsDetailedContact extends Schema.Component {
  collectionName: 'components_address_detailed_contacts';
  info: {
    displayName: 'detailed Contact';
    description: '';
  };
  attributes: {
    contactPersonName: Attribute.String & Attribute.Required;
    email: Attribute.Email & Attribute.Required;
    contactNumber: Attribute.String & Attribute.Required;
    contactType: Attribute.Enumeration<
      ['Personal', 'Parents', 'Guardian', 'Doctor', 'Pharmacy', 'Hospital']
    > &
      Attribute.DefaultTo<'Personal'>;
    country: Attribute.String &
      Attribute.CustomField<'plugin::country-select.country'>;
    relation: Attribute.String;
    contactDegree: Attribute.String;
  };
}

export interface UserVitalAllergy extends Schema.Component {
  collectionName: 'comp_vital_allergies';
  info: {
    displayName: 'allergy';
    description: '';
  };
  attributes: {
    allergyType: Attribute.String & Attribute.Required;
    alleryComponent: Attribute.String & Attribute.Required;
    description: Attribute.String;
    diagnosedDate: Attribute.Date;
  };
}

export interface UserVitalChronicCondition extends Schema.Component {
  collectionName: 'comp_vital_chronic_conditions';
  info: {
    displayName: 'chronic Condition';
    description: '';
  };
  attributes: {
    condition: Attribute.Relation<
      'user-vital.chronic-condition',
      'oneToOne',
      'api::chronic.chronic'
    >;
    value: Attribute.String & Attribute.Required;
    diagnosedDate: Attribute.Date;
    description: Attribute.String;
  };
}

export interface UserVitalCovidVaccine extends Schema.Component {
  collectionName: 'comp_vital_covid_vaccines';
  info: {
    displayName: 'covid Vaccine';
  };
  attributes: {
    vaccineName: Attribute.String;
    admissionSite: Attribute.String;
    Shot: Attribute.Enumeration<['First', 'Second', 'Third', 'Booster']> &
      Attribute.DefaultTo<'First'>;
    shotDate: Attribute.Date;
  };
}

export interface UserVitalDiagnosticService extends Schema.Component {
  collectionName: 'comp_vital_diagnostic_services';
  info: {
    displayName: 'Diagnostic Service';
    description: '';
  };
  attributes: {
    serviceName: Attribute.Relation<
      'user-vital.diagnostic-service',
      'oneToOne',
      'api::diagnostic-service.diagnostic-service'
    >;
    serviceProvider: Attribute.Relation<
      'user-vital.diagnostic-service',
      'oneToOne',
      'api::diagnostic-service-vendor.diagnostic-service-vendor'
    >;
    diagnosedDate: Attribute.Date;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    value: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    media: Attribute.Media;
    publish: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface UserVitalFitnessRegime extends Schema.Component {
  collectionName: 'comp_vital_fitness_regimes';
  info: {
    displayName: 'fitness Regime';
    description: '';
  };
  attributes: {
    fitnessLevel: Attribute.Enumeration<
      ['Sedentary', 'Moderate', 'Intermediate', 'Advanced']
    > &
      Attribute.DefaultTo<'Moderate'>;
    description: Attribute.Text;
  };
}

export interface UserVitalMedicalCondition extends Schema.Component {
  collectionName: 'comp_vital_medical_conditions';
  info: {
    displayName: 'medical Condition';
    description: '';
  };
  attributes: {
    condition: Attribute.Relation<
      'user-vital.medical-condition',
      'oneToOne',
      'api::chronic.chronic'
    >;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    conditionType: Attribute.Enumeration<['past', 'present', 'other']> &
      Attribute.DefaultTo<'past'>;
    diagnosedDate: Attribute.Date;
    diagnosedValue: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface UserVitalVaccineRecords extends Schema.Component {
  collectionName: 'comp_vital_vaccine_records';
  info: {
    displayName: 'Vaccine Records';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    givenBy: Attribute.String;
    vaccinationDate: Attribute.Date;
    description: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'diet.diet-component': DietDietComponent;
      'diet.diet-foods': DietDietFoods;
      'form-field-type.boolean-question': FormFieldTypeBooleanQuestion;
      'form-field-type.choice-options': FormFieldTypeChoiceOptions;
      'form-field-type.choice-question': FormFieldTypeChoiceQuestion;
      'form-field-type.date-question': FormFieldTypeDateQuestion;
      'form-field-type.date-time-question': FormFieldTypeDateTimeQuestion;
      'form-field-type.decimal-question': FormFieldTypeDecimalQuestion;
      'form-field-type.form-validation': FormFieldTypeFormValidation;
      'form-field-type.integer-question': FormFieldTypeIntegerQuestion;
      'form-field-type.reference-question': FormFieldTypeReferenceQuestion;
      'form-field-type.string-question': FormFieldTypeStringQuestion;
      'form-field-type.text-question': FormFieldTypeTextQuestion;
      'form-field-type.time-question': FormFieldTypeTimeQuestion;
      'form-field-type.validator-value-msg': FormFieldTypeValidatorValueMsg;
      'form.form-answer': FormFormAnswer;
      'masterdata.contact-us': MasterdataContactUs;
      'masterdata.emergency-helpline': MasterdataEmergencyHelpline;
      'medical.emergency-service': MedicalEmergencyService;
      'medical.medicine': MedicalMedicine;
      'medical.prescription': MedicalPrescription;
      'medical.user-insurance': MedicalUserInsurance;
      'mobile-ui.about-us': MobileUiAboutUs;
      'mobile-ui.banner': MobileUiBanner;
      'mobile-ui.button': MobileUiButton;
      'mobile-ui.link': MobileUiLink;
      'mobile-ui.news-letter': MobileUiNewsLetter;
      'mobile-ui.sg-offer-item': MobileUiSgOfferItem;
      'mobile-ui.sg-offer': MobileUiSgOffer;
      'mobile-ui.sg-offerings': MobileUiSgOfferings;
      'mobile-ui.testimonials': MobileUiTestimonials;
      'price.discount': PriceDiscount;
      'price.price-details': PricePriceDetails;
      'price.product-price': PriceProductPrice;
      'price.tax': PriceTax;
      'service-components.banner': ServiceComponentsBanner;
      'service-components.content-price': ServiceComponentsContentPrice;
      'service-components.faq': ServiceComponentsFaq;
      'service-components.metadata': ServiceComponentsMetadata;
      'service-components.offerings': ServiceComponentsOfferings;
      'service-components.product-content': ServiceComponentsProductContent;
      'service-components.product-form': ServiceComponentsProductForm;
      'service-components.product-price-rule': ServiceComponentsProductPriceRule;
      'service-components.product-price': ServiceComponentsProductPrice;
      'service-components.service-data': ServiceComponentsServiceData;
      'service-components.service-description': ServiceComponentsServiceDescription;
      'service-components.service-enquiry': ServiceComponentsServiceEnquiry;
      'service-components.service-faq': ServiceComponentsServiceFaq;
      'service-components.service-price': ServiceComponentsServicePrice;
      'service-components.service-working-steps': ServiceComponentsServiceWorkingSteps;
      'service-components.steps': ServiceComponentsSteps;
      'system.form-field': SystemFormField;
      'user-contacts.address': UserContactsAddress;
      'user-contacts.contact': UserContactsContact;
      'user-contacts.detailed-contact': UserContactsDetailedContact;
      'user-vital.allergy': UserVitalAllergy;
      'user-vital.chronic-condition': UserVitalChronicCondition;
      'user-vital.covid-vaccine': UserVitalCovidVaccine;
      'user-vital.diagnostic-service': UserVitalDiagnosticService;
      'user-vital.fitness-regime': UserVitalFitnessRegime;
      'user-vital.medical-condition': UserVitalMedicalCondition;
      'user-vital.vaccine-records': UserVitalVaccineRecords;
    }
  }
}
