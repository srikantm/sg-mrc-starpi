import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginGoogleMapsConfig extends Schema.SingleType {
  collectionName: 'google_maps_configs';
  info: {
    singularName: 'config';
    pluralName: 'configs';
    displayName: 'Google Maps Config';
  };
  options: {
    populateCreatorFields: false;
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    googleMapsKey: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<''>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::google-maps.config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::google-maps.config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    gender: Attribute.Enumeration<['Male', 'Female', 'Other']> &
      Attribute.DefaultTo<'Male'>;
    phoneNumber: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 10;
        maxLength: 20;
      }>;
    dateOfBirth: Attribute.Date & Attribute.Required;
    address: Attribute.Component<'user-contacts.address'>;
    relation: Attribute.String;
    profileImg: Attribute.Media;
    members: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    uniqueKey: Attribute.String &
      Attribute.CustomField<
        'plugin::custom-entity-key.unique-key',
        {
          attributes: 'username, email';
        }
      >;
    firstName: Attribute.String & Attribute.Required;
    lastName: Attribute.String & Attribute.Required;
    user_subscriptions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::user-subscription.user-subscription'
    >;
    phr: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::phr.phr'
    >;
    user_detail: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::user-detail.user-detail'
    >;
    userTags: Attribute.JSON & Attribute.CustomField<'plugin::tagsinput.tags'>;
    diet_chart: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::diet-chart.diet-chart'
    >;
    family: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::family.family'
    >;
    isFamilyMember: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    requestedServices: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::service-tracker.service-tracker'
    >;
    services_trackers: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::service-tracker.service-tracker'
    >;
    subscriptions: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::subscription-tracker.subscription-tracker'
    >;
    fcm: Attribute.String & Attribute.Private;
    user_notifications: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::user-notification.user-notification'
    >;
    care_coach: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::care-coach.care-coach'
    >;
    createdSubscriptions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::subscription-tracker.subscription-tracker'
    >;
    isEmailVerified: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPhoneNumberVerified: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBenefitBenefit extends Schema.CollectionType {
  collectionName: 'benefits';
  info: {
    singularName: 'benefit';
    pluralName: 'benefits';
    displayName: 'Benefit';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    code: Attribute.String & Attribute.Required & Attribute.Unique;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::benefit.benefit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::benefit.benefit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCareCoachCareCoach extends Schema.CollectionType {
  collectionName: 'care_coaches';
  info: {
    singularName: 'care-coach';
    pluralName: 'care-coaches';
    displayName: 'CareCoach';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastName: Attribute.String;
    contactNo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    profileImg: Attribute.Media;
    members: Attribute.Relation<
      'api::care-coach.care-coach',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::care-coach.care-coach',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::care-coach.care-coach',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChronicChronic extends Schema.CollectionType {
  collectionName: 'chronics';
  info: {
    singularName: 'chronic';
    pluralName: 'chronics';
    displayName: 'Medical Conditions';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    shortDescription: Attribute.String;
    maxMeasureValue: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chronic.chronic',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chronic.chronic',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiagnosticServiceDiagnosticService
  extends Schema.CollectionType {
  collectionName: 'diagnostic_services';
  info: {
    singularName: 'diagnostic-service';
    pluralName: 'diagnostic-services';
    displayName: 'Diagnostic Services';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    maxValue: Attribute.String;
    description: Attribute.String;
    serviceProviders: Attribute.Relation<
      'api::diagnostic-service.diagnostic-service',
      'manyToMany',
      'api::diagnostic-service-vendor.diagnostic-service-vendor'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::diagnostic-service.diagnostic-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::diagnostic-service.diagnostic-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiagnosticServiceVendorDiagnosticServiceVendor
  extends Schema.CollectionType {
  collectionName: 'diagnostic_service_vendors';
  info: {
    singularName: 'diagnostic-service-vendor';
    pluralName: 'diagnostic-service-vendors';
    displayName: 'Diagnostic Service Vendors';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    address: Attribute.Component<'user-contacts.address'>;
    contact: Attribute.Component<'user-contacts.contact', true>;
    services: Attribute.Relation<
      'api::diagnostic-service-vendor.diagnostic-service-vendor',
      'manyToMany',
      'api::diagnostic-service.diagnostic-service'
    >;
    phr: Attribute.Relation<
      'api::diagnostic-service-vendor.diagnostic-service-vendor',
      'oneToOne',
      'api::phr.phr'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::diagnostic-service-vendor.diagnostic-service-vendor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::diagnostic-service-vendor.diagnostic-service-vendor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDietChartDietChart extends Schema.CollectionType {
  collectionName: 'diet_charts';
  info: {
    singularName: 'diet-chart';
    pluralName: 'diet-charts';
    displayName: 'Diet Chart';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::diet-chart.diet-chart',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    DietDays: Attribute.Component<'diet.diet-component', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::diet-chart.diet-chart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::diet-chart.diet-chart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDoctorSpecializationDoctorSpecialization
  extends Schema.CollectionType {
  collectionName: 'doctor_specializations';
  info: {
    singularName: 'doctor-specialization';
    pluralName: 'doctor-specializations';
    displayName: 'DoctorSpecialization';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::doctor-specialization.doctor-specialization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::doctor-specialization.doctor-specialization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFamilyFamily extends Schema.CollectionType {
  collectionName: 'families';
  info: {
    singularName: 'family';
    pluralName: 'families';
    displayName: 'Family';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    users: Attribute.Relation<
      'api::family.family',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    service_trackers: Attribute.Relation<
      'api::family.family',
      'oneToMany',
      'api::service-tracker.service-tracker'
    >;
    subscription_trackers: Attribute.Relation<
      'api::family.family',
      'oneToMany',
      'api::subscription-tracker.subscription-tracker'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::family.family',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::family.family',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFoodDbFoodDb extends Schema.CollectionType {
  collectionName: 'food_dbs';
  info: {
    singularName: 'food-db';
    pluralName: 'food-dbs';
    displayName: 'foodDb';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    calorie: Attribute.Decimal;
    protein: Attribute.Decimal;
    carbs: Attribute.Decimal;
    fibre: Attribute.Decimal;
    fats: Attribute.Decimal;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::food-db.food-db',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::food-db.food-db',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMasterdataMasterdata extends Schema.SingleType {
  collectionName: 'master_data';
  info: {
    singularName: 'masterdata';
    pluralName: 'master-data';
    displayName: 'Masterdata';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contactUs: Attribute.Component<'masterdata.contact-us'>;
    emergencyHelpline: Attribute.Component<'masterdata.emergency-helpline'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::masterdata.masterdata',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::masterdata.masterdata',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: 'pages';
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    content: Attribute.DynamicZone<
      [
        'mobile-ui.testimonials',
        'mobile-ui.about-us',
        'mobile-ui.banner',
        'mobile-ui.news-letter'
      ]
    > &
      Attribute.Required;
    code: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPaymentTransactionPaymentTransaction
  extends Schema.CollectionType {
  collectionName: 'payment_transactions';
  info: {
    singularName: 'payment-transaction';
    pluralName: 'payment-transactions';
    displayName: 'paymentTransaction';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    transactionDate: Attribute.DateTime & Attribute.Required;
    status: Attribute.Enumeration<
      ['FAILED', 'SUCCESS', 'PENDING', 'CANCELLED']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'PENDING'>;
    vendorResponse: Attribute.JSON;
    request: Attribute.JSON;
    paymentFor: Attribute.Enumeration<['SERVICE', 'WALLET', 'SUBSCRIPTION']> &
      Attribute.DefaultTo<'SERVICE'>;
    value: Attribute.Decimal & Attribute.Required;
    paymentMethod: Attribute.Enumeration<
      ['CARD', 'INTERNETBANKING', 'UPI', 'COD', 'WALLET', 'EMI', 'UNKNOWN']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'UNKNOWN'>;
    user: Attribute.Relation<
      'api::payment-transaction.payment-transaction',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    uniqueKey: Attribute.String &
      Attribute.CustomField<
        'plugin::custom-entity-key.unique-key',
        {
          attributes: 'user.email, value, transactionDate';
        }
      >;
    service_tracker: Attribute.Relation<
      'api::payment-transaction.payment-transaction',
      'manyToOne',
      'api::service-tracker.service-tracker'
    >;
    vendor: Attribute.Enumeration<['razorpay']>;
    vendorPaymentId: Attribute.String;
    subscription_tracker: Attribute.Relation<
      'api::payment-transaction.payment-transaction',
      'manyToOne',
      'api::subscription-tracker.subscription-tracker'
    >;
    vendorInvoiceId: Attribute.String;
    invoice: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::payment-transaction.payment-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::payment-transaction.payment-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPhrPhr extends Schema.CollectionType {
  collectionName: 'phrs';
  info: {
    singularName: 'phr';
    pluralName: 'phrs';
    displayName: 'PHR';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    firstName: Attribute.String & Attribute.Required;
    lastName: Attribute.String & Attribute.Required;
    age: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 10;
          max: 100;
        },
        number
      >;
    email: Attribute.Email & Attribute.Required;
    gender: Attribute.Enumeration<['male', 'female', 'other']>;
    bloodGroup: Attribute.Enumeration<
      [
        '(A+) A RhD positive',
        '(A-) A RhD negative',
        '(B+) B RhD positive',
        '(B-) B RhD negative',
        '(O+) O RhD positive',
        '(O-) O RhD negative',
        '(AB+) AB RhD positive',
        '(AB-) AB RhD negative'
      ]
    >;
    documents: Attribute.Media;
    downloadPhr: Attribute.Boolean & Attribute.DefaultTo<false>;
    address: Attribute.Component<'user-contacts.address'>;
    uniqueKey: Attribute.String &
      Attribute.CustomField<
        'plugin::custom-entity-key.unique-key',
        {
          attributes: 'firstName, lastName';
        }
      >;
    chronicCondition: Attribute.Component<'user-vital.chronic-condition', true>;
    vaccineRecords: Attribute.Component<'user-vital.vaccine-records', true>;
    diagnosedServices: Attribute.Component<
      'user-vital.diagnostic-service',
      true
    >;
    medicalConditions: Attribute.Component<
      'user-vital.medical-condition',
      true
    >;
    covidVaccines: Attribute.Component<'user-vital.covid-vaccine', true>;
    fitnessRegime: Attribute.Component<'user-vital.fitness-regime'>;
    prescription: Attribute.Component<'medical.prescription', true>;
    belongsTo: Attribute.Relation<
      'api::phr.phr',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    allergies: Attribute.Component<'user-vital.allergy', true>;
    additionalInformation: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::phr.phr', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::phr.phr', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Product';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['subscription', 'service']> &
      Attribute.Required &
      Attribute.DefaultTo<'service'>;
    metadata: Attribute.Component<'service-components.metadata', true>;
    benefits: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::benefit.benefit'
    >;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    category: Attribute.Enumeration<
      ['homeCare', 'convenienceCare', 'healthCare', 'subscription']
    >;
    prices: Attribute.Component<'service-components.product-price', true>;
    code: Attribute.UID &
      Attribute.CustomField<'plugin::strapi-advanced-uuid.uuid'>;
    subscriptionContent: Attribute.Component<'service-components.product-content'>;
    form: Attribute.DynamicZone<
      [
        'form-field-type.boolean-question',
        'form-field-type.decimal-question',
        'form-field-type.date-question',
        'form-field-type.time-question',
        'form-field-type.date-time-question',
        'form-field-type.string-question',
        'form-field-type.reference-question',
        'form-field-type.choice-question',
        'form-field-type.text-question'
      ]
    >;
    serviceContent: Attribute.DynamicZone<
      [
        'service-components.service-working-steps',
        'service-components.service-description',
        'service-components.service-enquiry',
        'service-components.service-faq',
        'service-components.content-price',
        'service-components.offerings',
        'service-components.service-price',
        'service-components.banner'
      ]
    > &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    upgradeable_products: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product.product'
    >;
    icon: Attribute.Media & Attribute.Required;
    subscription_trackers: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::subscription-tracker.subscription-tracker'
    >;
    product_form: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::product-form.product-form'
    >;
    service_trackers: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::service-tracker.service-tracker'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductFormProductForm extends Schema.CollectionType {
  collectionName: 'product_forms';
  info: {
    singularName: 'product-form';
    pluralName: 'product-forms';
    displayName: 'ProductForm';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    form: Attribute.DynamicZone<
      [
        'form-field-type.date-question',
        'form-field-type.choice-question',
        'form-field-type.reference-question',
        'form-field-type.text-question',
        'form-field-type.decimal-question',
        'form-field-type.integer-question'
      ]
    > &
      Attribute.Required;
    products: Attribute.Relation<
      'api::product-form.product-form',
      'oneToMany',
      'api::product.product'
    >;
    service_trackers: Attribute.Relation<
      'api::product-form.product-form',
      'oneToMany',
      'api::service-tracker.service-tracker'
    >;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    answers: Attribute.Relation<
      'api::product-form.product-form',
      'oneToMany',
      'api::product-form-answer.product-form-answer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-form.product-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-form.product-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductFormAnswerProductFormAnswer
  extends Schema.CollectionType {
  collectionName: 'product_form_answers';
  info: {
    singularName: 'product-form-answer';
    pluralName: 'product-form-answers';
    displayName: 'ProductFormAnswer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    form: Attribute.Relation<
      'api::product-form-answer.product-form-answer',
      'manyToOne',
      'api::product-form.product-form'
    >;
    service: Attribute.Relation<
      'api::product-form-answer.product-form-answer',
      'oneToOne',
      'api::service-tracker.service-tracker'
    >;
    answers: Attribute.Component<'form.form-answer', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-form-answer.product-form-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-form-answer.product-form-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProgressNoteProgressNote extends Schema.CollectionType {
  collectionName: 'progress_notes';
  info: {
    singularName: 'progress-note';
    pluralName: 'progress-notes';
    displayName: 'Progress Note';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    client: Attribute.Relation<
      'api::progress-note.progress-note',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    VisitDate: Attribute.DateTime & Attribute.Required;
    careGiver: Attribute.Relation<
      'api::progress-note.progress-note',
      'oneToOne',
      'api::care-coach.care-coach'
    >;
    serviceProvided: Attribute.Relation<
      'api::progress-note.progress-note',
      'oneToOne',
      'api::sub-service.sub-service'
    >;
    clientReport: Attribute.Blocks & Attribute.Required;
    familyReport: Attribute.Blocks & Attribute.Required;
    physicalStatus: Attribute.Blocks & Attribute.Required;
    mobility: Attribute.Blocks & Attribute.Required;
    skin: Attribute.Blocks & Attribute.Required;
    emotionalStatus: Attribute.Blocks & Attribute.Required;
    progressAssessment: Attribute.Blocks & Attribute.Required;
    painAssessment: Attribute.Blocks & Attribute.Required;
    emotionalAssessment: Attribute.Blocks & Attribute.Required;
    overallStatus: Attribute.Blocks & Attribute.Required;
    careAdjustment: Attribute.Blocks & Attribute.Required;
    followUp: Attribute.Blocks & Attribute.Required;
    familyGuidance: Attribute.Blocks & Attribute.Required;
    medicalConsults: Attribute.Blocks & Attribute.Required;
    vitalSigns: Attribute.Blocks & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::progress-note.progress-note',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::progress-note.progress-note',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRazorpaySubscriptionRazorpaySubscription
  extends Schema.CollectionType {
  collectionName: 'razorpay_subscriptions';
  info: {
    singularName: 'razorpay-subscription';
    pluralName: 'razorpay-subscriptions';
    displayName: 'RazorpaySubscription';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    subscriptionId: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    status: Attribute.Enumeration<
      [
        'created',
        'authenticated',
        'active',
        'pending',
        'halted',
        'cancelled',
        'paused',
        'expired',
        'completed'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'created'>;
    planId: Attribute.String & Attribute.Required;
    notes: Attribute.Component<'service-components.metadata', true>;
    chargeAt: Attribute.DateTime;
    totalCount: Attribute.Integer;
    paidCount: Attribute.Integer;
    shortUrl: Attribute.String;
    hasScheduledChanges: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    remainingCount: Attribute.Integer;
    customerId: Attribute.String;
    subscription_trackers: Attribute.Relation<
      'api::razorpay-subscription.razorpay-subscription',
      'oneToMany',
      'api::subscription-tracker.subscription-tracker'
    >;
    currentStart: Attribute.DateTime;
    currentEnd: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::razorpay-subscription.razorpay-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::razorpay-subscription.razorpay-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceService extends Schema.CollectionType {
  collectionName: 'services';
  info: {
    singularName: 'service';
    pluralName: 'services';
    displayName: 'services';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    banners: Attribute.Media;
    icon: Attribute.Media;
    description: Attribute.RichText;
    subscriptionPlans: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::subscription-plan.subscription-plan'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceBookingServiceBooking extends Schema.CollectionType {
  collectionName: 'service_bookings';
  info: {
    singularName: 'service-booking';
    pluralName: 'service-bookings';
    displayName: 'serviceBooking';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    service: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'api::service.service'
    >;
    subService: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'api::sub-service.sub-service'
    >;
    status: Attribute.Enumeration<
      ['COMPLETE', 'PENDING', 'CANCELLED', 'FAILED']
    > &
      Attribute.DefaultTo<'PENDING'>;
    bookingDate: Attribute.Date;
    completionDate: Attribute.Date;
    bookedBy: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    serviceDuration: Attribute.Integer;
    period: Attribute.Enumeration<['day', 'night', 'day+night']>;
    comments: Attribute.RichText;
    serviceStartDate: Attribute.DateTime;
    payment: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'api::payment-transaction.payment-transaction'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-booking.service-booking',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceTrackerServiceTracker extends Schema.CollectionType {
  collectionName: 'service_trackers';
  info: {
    singularName: 'service-tracker';
    pluralName: 'service-trackers';
    displayName: 'ServiceTracker';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    product: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'manyToOne',
      'api::product.product'
    >;
    paymentStatus: Attribute.Enumeration<
      ['due', 'paid', 'partiallyPaid', 'expired']
    >;
    status: Attribute.Enumeration<
      [
        'requested',
        'processing',
        'processed',
        'active',
        'completed',
        'rejected'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'requested'>;
    family: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'manyToOne',
      'api::family.family'
    >;
    serviceFormAnwserJSON: Attribute.JSON;
    amount: Attribute.Decimal;
    priceId: Attribute.Integer;
    service_form: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'manyToOne',
      'api::product-form.product-form'
    >;
    requestedBy: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    requestedFor: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    requestedAt: Attribute.DateTime & Attribute.Required;
    form_answer: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'oneToOne',
      'api::product-form-answer.product-form-answer'
    >;
    razorpayOrderId: Attribute.String;
    metadata: Attribute.Component<'service-components.service-data', true>;
    payment_transactions: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'oneToMany',
      'api::payment-transaction.payment-transaction'
    >;
    priceDetails: Attribute.Component<'price.price-details'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-tracker.service-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSilverFormSilverForm extends Schema.CollectionType {
  collectionName: 'silver_forms';
  info: {
    singularName: 'silver-form';
    pluralName: 'silver-forms';
    displayName: 'silverForm';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID & Attribute.Required;
    fields: Attribute.Component<'system.form-field', true>;
    description: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::silver-form.silver-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::silver-form.silver-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSilverFormSubmitSilverFormSubmit
  extends Schema.CollectionType {
  collectionName: 'silver_form_submits';
  info: {
    singularName: 'silver-form-submit';
    pluralName: 'silver-form-submits';
    displayName: 'silverFormSubmit';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    silver_form: Attribute.Relation<
      'api::silver-form-submit.silver-form-submit',
      'oneToOne',
      'api::silver-form.silver-form'
    >;
    details: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::silver-form-submit.silver-form-submit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::silver-form-submit.silver-form-submit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubServiceSubService extends Schema.CollectionType {
  collectionName: 'sub_services';
  info: {
    singularName: 'sub-service';
    pluralName: 'sub-services';
    displayName: 'subService';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.RichText;
    service: Attribute.Relation<
      'api::sub-service.sub-service',
      'oneToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sub-service.sub-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sub-service.sub-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionPlanSubscriptionPlan
  extends Schema.CollectionType {
  collectionName: 'subscription_plans';
  info: {
    singularName: 'subscription-plan';
    pluralName: 'subscription-plans';
    displayName: 'subscriptionPlan';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.RichText;
    duration: Attribute.Integer;
    price: Attribute.Integer;
    discount: Attribute.Decimal;
    tax: Attribute.Integer;
    isActive: Attribute.Boolean & Attribute.DefaultTo<true>;
    service: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'manyToOne',
      'api::service.service'
    >;
    uniqueKey: Attribute.String &
      Attribute.CustomField<
        'plugin::custom-entity-key.unique-key',
        {
          attributes: 'service.name,name';
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionTrackerSubscriptionTracker
  extends Schema.CollectionType {
  collectionName: 'subscription_trackers';
  info: {
    singularName: 'subscription-tracker';
    pluralName: 'subscription-trackers';
    displayName: 'SubscriptionTracker';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    paymentStatus: Attribute.Enumeration<
      ['due', 'paid', 'partiallyPaid', 'expired']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'due'>;
    status: Attribute.Enumeration<
      [
        'requested',
        'processing',
        'processed',
        'active',
        'completed',
        'rejected'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'requested'>;
    expiresOn: Attribute.DateTime;
    startDate: Attribute.DateTime;
    family: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'manyToOne',
      'api::family.family'
    >;
    product: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'manyToOne',
      'api::product.product'
    >;
    benefits: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'oneToMany',
      'api::benefit.benefit'
    >;
    subscribedBy: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    amount: Attribute.Integer;
    priceId: Attribute.Integer;
    razorpaySubscriptionId: Attribute.String;
    metadata: Attribute.Component<'service-components.metadata', true>;
    belongsTo: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    payment_transactions: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'oneToMany',
      'api::payment-transaction.payment-transaction'
    >;
    subscriptionStatus: Attribute.Enumeration<['Active', 'Expired']> &
      Attribute.DefaultTo<'Active'>;
    razorpay_subscription: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'manyToOne',
      'api::razorpay-subscription.razorpay-subscription'
    >;
    priceDetail: Attribute.Component<'price.price-details'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-tracker.subscription-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTestimonialTestimonial extends Schema.CollectionType {
  collectionName: 'testimonials';
  info: {
    singularName: 'testimonial';
    pluralName: 'testimonials';
    displayName: 'Testimonial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Attribute.Text & Attribute.Required;
    testifierName: Attribute.String & Attribute.Required;
    testifierImage: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::testimonial.testimonial',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::testimonial.testimonial',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserDetailUserDetail extends Schema.CollectionType {
  collectionName: 'user_details';
  info: {
    singularName: 'user-detail';
    pluralName: 'user-details';
    displayName: 'UserDetail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::user-detail.user-detail',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    emergencyContacts: Attribute.Component<
      'user-contacts.detailed-contact',
      true
    >;
    UserInsurance: Attribute.Component<'medical.user-insurance', true>;
    preferredServices: Attribute.Component<'medical.emergency-service', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-detail.user-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-detail.user-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserDocumentUserDocument extends Schema.CollectionType {
  collectionName: 'user_documents';
  info: {
    singularName: 'user-document';
    pluralName: 'user-documents';
    displayName: 'userDocument';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    comment: Attribute.String;
    document: Attribute.Media;
    user: Attribute.Relation<
      'api::user-document.user-document',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    documentType: Attribute.Enumeration<
      [
        'Prescription',
        'Laboratory Results',
        'Radiology & Imaging Results',
        'Diagnostic Reports',
        'Hospital Reports'
      ]
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-document.user-document',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-document.user-document',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserFoodLogUserFoodLog extends Schema.CollectionType {
  collectionName: 'user_food_logs';
  info: {
    singularName: 'user-food-log';
    pluralName: 'user-food-logs';
    displayName: 'User Food Log';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: Attribute.Relation<
      'api::user-food-log.user-food-log',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    foodItems: Attribute.Relation<
      'api::user-food-log.user-food-log',
      'oneToMany',
      'api::food-db.food-db'
    >;
    LogTime: Attribute.DateTime & Attribute.Required;
    when: Attribute.Enumeration<
      ['BREAKFAST', 'BRUNCH', 'LUNCH', 'EVENING SNACK', 'DINNER']
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-food-log.user-food-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-food-log.user-food-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserNotificationUserNotification
  extends Schema.CollectionType {
  collectionName: 'user_notifications';
  info: {
    singularName: 'user-notification';
    pluralName: 'user-notifications';
    displayName: 'userNotification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    message: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    read: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['default', 'app']> &
      Attribute.Required &
      Attribute.DefaultTo<'default'>;
    image: Attribute.Media;
    user: Attribute.Relation<
      'api::user-notification.user-notification',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    readAt: Attribute.DateTime;
    actionType: Attribute.Enumeration<['openPage', 'none']> &
      Attribute.Required &
      Attribute.DefaultTo<'none'>;
    actionUrl: Attribute.String;
    additionalData: Attribute.Component<'service-components.metadata', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserSubscriptionUserSubscription
  extends Schema.CollectionType {
  collectionName: 'user_subscriptions';
  info: {
    singularName: 'user-subscription';
    pluralName: 'user-subscriptions';
    displayName: 'userSubscription';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::user-subscription.user-subscription',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    startDate: Attribute.DateTime;
    subscription_plan: Attribute.Relation<
      'api::user-subscription.user-subscription',
      'oneToOne',
      'api::subscription-plan.subscription-plan'
    >;
    paymentCompleted: Attribute.Boolean & Attribute.DefaultTo<false>;
    comment: Attribute.Text;
    endDate: Attribute.DateTime;
    isActive: Attribute.Boolean & Attribute.DefaultTo<false>;
    uniqueKey: Attribute.String &
      Attribute.CustomField<
        'plugin::custom-entity-key.unique-key',
        {
          attributes: 'subscription_plan.uniqueKey';
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-subscription.user-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-subscription.user-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWebAppLogoWebAppLogo extends Schema.SingleType {
  collectionName: 'web_app_logos';
  info: {
    singularName: 'web-app-logo';
    pluralName: 'web-app-logos';
    displayName: 'webAppLogo';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    header: Attribute.Media;
    footer: Attribute.Media;
    icon: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::web-app-logo.web-app-logo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::web-app-logo.web-app-logo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWebhookWebhook extends Schema.CollectionType {
  collectionName: 'webhooks';
  info: {
    singularName: 'webhook';
    pluralName: 'webhooks';
    displayName: 'webhook';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::webhook.webhook',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::webhook.webhook',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::google-maps.config': PluginGoogleMapsConfig;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::benefit.benefit': ApiBenefitBenefit;
      'api::care-coach.care-coach': ApiCareCoachCareCoach;
      'api::chronic.chronic': ApiChronicChronic;
      'api::diagnostic-service.diagnostic-service': ApiDiagnosticServiceDiagnosticService;
      'api::diagnostic-service-vendor.diagnostic-service-vendor': ApiDiagnosticServiceVendorDiagnosticServiceVendor;
      'api::diet-chart.diet-chart': ApiDietChartDietChart;
      'api::doctor-specialization.doctor-specialization': ApiDoctorSpecializationDoctorSpecialization;
      'api::family.family': ApiFamilyFamily;
      'api::food-db.food-db': ApiFoodDbFoodDb;
      'api::masterdata.masterdata': ApiMasterdataMasterdata;
      'api::page.page': ApiPagePage;
      'api::payment-transaction.payment-transaction': ApiPaymentTransactionPaymentTransaction;
      'api::phr.phr': ApiPhrPhr;
      'api::product.product': ApiProductProduct;
      'api::product-form.product-form': ApiProductFormProductForm;
      'api::product-form-answer.product-form-answer': ApiProductFormAnswerProductFormAnswer;
      'api::progress-note.progress-note': ApiProgressNoteProgressNote;
      'api::razorpay-subscription.razorpay-subscription': ApiRazorpaySubscriptionRazorpaySubscription;
      'api::service.service': ApiServiceService;
      'api::service-booking.service-booking': ApiServiceBookingServiceBooking;
      'api::service-tracker.service-tracker': ApiServiceTrackerServiceTracker;
      'api::silver-form.silver-form': ApiSilverFormSilverForm;
      'api::silver-form-submit.silver-form-submit': ApiSilverFormSubmitSilverFormSubmit;
      'api::sub-service.sub-service': ApiSubServiceSubService;
      'api::subscription-plan.subscription-plan': ApiSubscriptionPlanSubscriptionPlan;
      'api::subscription-tracker.subscription-tracker': ApiSubscriptionTrackerSubscriptionTracker;
      'api::testimonial.testimonial': ApiTestimonialTestimonial;
      'api::user-detail.user-detail': ApiUserDetailUserDetail;
      'api::user-document.user-document': ApiUserDocumentUserDocument;
      'api::user-food-log.user-food-log': ApiUserFoodLogUserFoodLog;
      'api::user-notification.user-notification': ApiUserNotificationUserNotification;
      'api::user-subscription.user-subscription': ApiUserSubscriptionUserSubscription;
      'api::web-app-logo.web-app-logo': ApiWebAppLogoWebAppLogo;
      'api::webhook.webhook': ApiWebhookWebhook;
    }
  }
}
