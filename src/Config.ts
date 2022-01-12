export enum ModelFeature {
  LED_Projector = 'LED_PROJECTOR',
  Power_Liftgate = 'POWER_LIFTGATE',
  Door_Handles = 'DOOR_HANDLES',
  Front_Doors = 'FRONT_DOORS',
  Falcon_Doors = 'FALCON_DOORS',
  Signature_Ramping = 'SIGNATURE_RAMPING',
  Front_Turn_ramping = 'FROMT_TURN_RAMPING',
}

export enum Model {
  Model_S = 'MODEL_S',
  Model_3 = 'MODEL_3',
  Model_X = 'MODEL_X',
  Model_Y = 'MODEL_Y',
}

export enum ChannelType {
  Light_Ramping = 'LIGHT_RAMPING',
  Light_Boolean = 'LIGHT_BOOLEAN',
  Closure = 'CLOSURE',
}

export interface IChannelOverride {
  channelId: number;
  type: ChannelType;
  features?: Array<ModelFeature>;
  disabled?: Boolean;
}

export interface IVehicle {
  model: Model;
  name: String;
  startYear: number;
  features: Array<ModelFeature>;
  channelOverrides?: Array<IChannelOverride>;
  optionalFeatures: Array<ModelFeature>;
}

export const vehicles: Array<IVehicle> = [
  {
    model: Model.Model_S,
    name: 'Model S',
    startYear: 2021,
    features: [ModelFeature.Power_Liftgate, ModelFeature.Door_Handles],
    optionalFeatures: [],
  },
  {
    model: Model.Model_3,
    name: 'Model 3',
    startYear: 2017,
    features: [ModelFeature.Signature_Ramping, ModelFeature.Front_Turn_ramping],
    channelOverrides: [
      { channelId: 1, type: ChannelType.Light_Boolean, features: [ModelFeature.LED_Projector] },
      { channelId: 2, type: ChannelType.Light_Boolean, features: [ModelFeature.LED_Projector] },

      // signature
      { channelId: 5, type: ChannelType.Light_Ramping },
      { channelId: 6, type: ChannelType.Light_Ramping },

      // front turn
      { channelId: 13, type: ChannelType.Light_Ramping },
      { channelId: 14, type: ChannelType.Light_Ramping },
    ],
    optionalFeatures: [ModelFeature.Power_Liftgate, ModelFeature.LED_Projector],
  },
  {
    model: Model.Model_X,
    name: 'Model X',
    startYear: 2021,
    features: [ModelFeature.Power_Liftgate, ModelFeature.Front_Doors, ModelFeature.Falcon_Doors],
    optionalFeatures: [],
  },
  {
    model: Model.Model_Y,
    name: 'Model Y',
    startYear: 2020,
    features: [ModelFeature.Signature_Ramping, ModelFeature.Front_Turn_ramping],
    channelOverrides: [
      { channelId: 1, type: ChannelType.Light_Boolean, features: [ModelFeature.LED_Projector] },
      { channelId: 2, type: ChannelType.Light_Boolean, features: [ModelFeature.LED_Projector] },

      // signature
      { channelId: 5, type: ChannelType.Light_Ramping },
      { channelId: 6, type: ChannelType.Light_Ramping },

      // front turn
      { channelId: 13, type: ChannelType.Light_Ramping },
      { channelId: 14, type: ChannelType.Light_Ramping },
    ],
    optionalFeatures: [ModelFeature.Power_Liftgate, ModelFeature.LED_Projector],
  },
];

export interface IChannel {
  id: number;
  title: string;
  type: ChannelType;
  canDance?: Boolean;
  commandLimit?: number;
  features?: Array<ModelFeature>;

  // denotes 3d coordinates as in a list, as some tracks has more than one point
  points: Array<Array<number>>;
}

export const channelsConfig: Array<IChannel> = [
  { id: 1, title: 'Left Outer Main Beam', type: ChannelType.Light_Ramping, points: [[444.0, 132.0, -148.0]] },
  { id: 2, title: 'Right Outer Main Beam', type: ChannelType.Light_Ramping, points: [[444.0, 132.0, 144.0]] },
  { id: 3, title: 'Left Inner Main Beam', type: ChannelType.Light_Ramping, points: [[456.0, 128.0, -128.0]] },
  { id: 4, title: 'Right Inner Main Beam', type: ChannelType.Light_Ramping, points: [[456.0, 128.0, 124.0]] },
  { id: 5, title: 'Left Signature', type: ChannelType.Light_Boolean, points: [[428.0, 148.0, -160.0]] },
  { id: 6, title: 'Right Signature', type: ChannelType.Light_Boolean, points: [[428.0, 148.0, 160.0]] },
  { id: 7, title: 'Left Channel 4', type: ChannelType.Light_Ramping, points: [[436.0, 144.0, -148.0]] },
  { id: 8, title: 'Right Channel 4', type: ChannelType.Light_Ramping, points: [[436.0, 144.0, 148.0]] },
  { id: 9, title: 'Left Channel 5', type: ChannelType.Light_Ramping, points: [[448.0, 140.0, -132.0]] },
  { id: 10, title: 'Right Channel 5', type: ChannelType.Light_Ramping, points: [[448.0, 140.0, 132.0]] },
  { id: 11, title: 'Left Channel 6', type: ChannelType.Light_Ramping, points: [[460.0, 136.0, -116.0]] },
  { id: 12, title: 'Right Channel 6', type: ChannelType.Light_Ramping, points: [[460.0, 136.0, 116.0]] },
  { id: 13, title: 'Left Front Turn', type: ChannelType.Light_Boolean, points: [[428.0, 136.0, -168.0]] },
  { id: 14, title: 'Right Front Turn', type: ChannelType.Light_Boolean, points: [[428.0, 136.0, 168.0]] },
  { id: 15, title: 'Left Front Fog', type: ChannelType.Light_Boolean, points: [[444.0, 80.0, -168.0]] },
  { id: 16, title: 'Right Front Fog', type: ChannelType.Light_Boolean, points: [[444.0, 80.0, 168.0]] },
  { id: 17, title: 'Left Aux Park', type: ChannelType.Light_Boolean, points: [[460.0, 80.0, -152.0]] },
  { id: 18, title: 'Right Aux Park', type: ChannelType.Light_Boolean, points: [[460.0, 80.0, 152.0]] },
  { id: 19, title: 'Left Side Marker', type: ChannelType.Light_Boolean, points: [[472.0, 76.0, -136.0]] },
  { id: 20, title: 'Right Side Marker', type: ChannelType.Light_Boolean, points: [[472.0, 76.0, 136.0]] },
  { id: 21, title: 'Left Side Repeater', type: ChannelType.Light_Boolean, points: [[252.0, 148.0, -196.0]] },
  { id: 22, title: 'Right Side Repeater', type: ChannelType.Light_Boolean, points: [[252.0, 148.0, 196.0]] },
  { id: 23, title: 'Left Rear Turn', type: ChannelType.Light_Boolean, points: [[-436.0, 172.0, -148.0]] },
  { id: 24, title: 'Right Rear Turn', type: ChannelType.Light_Boolean, points: [[-436.0, 172.0, 148.0]] },
  {
    id: 25,
    title: 'Brake Lights',
    type: ChannelType.Light_Boolean,
    points: [
      [-428.0, 180.0, 156.0],
      [-260.0, 268.0, 0.0],
      [-428.0, 180.0, -156.0],
    ],
  },
  {
    id: 26,
    title: 'Left Tail',
    type: ChannelType.Light_Boolean,
    points: [
      [-448.0, 180.0, -120.0],
      [-452.0, 164.0, -120.0],
      [-428.0, 168.0, -160.0],
    ],
  },
  {
    id: 27,
    title: 'Right Tail',
    type: ChannelType.Light_Boolean,
    points: [
      [-428.0, 168.0, 160.0],
      [-448.0, 180.0, 120.0],
      [-452.0, 164.0, 120.0],
    ],
  },
  {
    id: 28,
    title: 'Reverse Lights',
    type: ChannelType.Light_Boolean,
    points: [
      [-456.0, 172.0, 108.0],
      [-456.0, 172.0, -108.0],
    ],
  },
  {
    id: 29,
    title: 'Rear Fog Lights',
    type: ChannelType.Light_Boolean,
    points: [
      [-460.0, 172.0, 96.0],
      [-460.0, 172.0, -96.0],
    ],
  },
  {
    id: 30,
    title: 'License Plate',
    type: ChannelType.Light_Boolean,
    points: [
      [-472.0, 164.0, 28.0],
      [-472.0, 164.0, -28.0],
    ],
  },
  {
    id: 31,
    title: 'Left Falcon Door',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    features: [ModelFeature.Falcon_Doors],
    points: [[-108.0, 136.0, -192.0]],
  },
  {
    id: 32,
    title: 'Right Falcon Door',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    features: [ModelFeature.Falcon_Doors],
    points: [[-108.0, 136.0, 192.0]],
  },
  {
    id: 33,
    title: 'Left Front Door',
    type: ChannelType.Closure,
    commandLimit: 6,
    features: [ModelFeature.Front_Doors],
    points: [[72.0, 128.0, -192.0]],
  },
  {
    id: 34,
    title: 'Right Front Door',
    type: ChannelType.Closure,
    commandLimit: 6,
    features: [ModelFeature.Front_Doors],
    points: [[72.0, 128.0, 192.0]],
  },
  { id: 35, title: 'Left Mirror', type: ChannelType.Closure, commandLimit: 20, points: [[124.0, 216.0, -196.0]] },
  { id: 36, title: 'Right Mirror', type: ChannelType.Closure, commandLimit: 20, points: [[124.0, 216.0, 196.0]] },
  {
    id: 37,
    title: 'Left Front Window',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    points: [[36.0, 228.0, -160.0]],
  },
  {
    id: 38,
    title: 'Left Rear Window',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    points: [[-128.0, 232.0, -156.0]],
  },
  {
    id: 39,
    title: 'Right Front Window',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    points: [[36.0, 228.0, 160.0]],
  },
  {
    id: 40,
    title: 'Right Rear Window',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    points: [[-128.0, 232.0, 156.0]],
  },
  {
    id: 41,
    title: 'Liftgate',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 6,
    points: [[-436.0, 216.0, 0.0]],
  },
  {
    id: 42,
    title: 'Left Front Door Handle',
    type: ChannelType.Closure,
    commandLimit: 20,
    features: [ModelFeature.Door_Handles],
    points: [[8.0, 172.0, -184.0]],
  },
  {
    id: 43,
    title: 'Left Rear Door Handle',
    type: ChannelType.Closure,
    commandLimit: 20,
    features: [ModelFeature.Door_Handles],
    points: [[-196.0, 184.0, -184.0]],
  },
  {
    id: 44,
    title: 'Right Front Door Handle',
    type: ChannelType.Closure,
    commandLimit: 20,
    features: [ModelFeature.Door_Handles],
    points: [[8.0, 172.0, 184.0]],
  },
  {
    id: 45,
    title: 'Right Rear Door Handle',
    type: ChannelType.Closure,
    commandLimit: 20,
    features: [ModelFeature.Door_Handles],

    points: [[-196.0, 184.0, 184.0]],
  },
  {
    id: 46,
    title: 'Charge Port',
    type: ChannelType.Closure,
    canDance: true,
    commandLimit: 3,
    features: [ModelFeature.Power_Liftgate],
    points: [[-392.0, 168.0, -176.0]],
  },
];
