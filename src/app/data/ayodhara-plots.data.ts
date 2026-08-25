export interface AyodharaPlot {
  plotNo: number;
  extentSqYds: number;
  facing: string;
}

export const AYODHARA_PLOTS: AyodharaPlot[] = [
  { plotNo: 1, extentSqYds: 167,    facing: 'East' },
  { plotNo: 2, extentSqYds: 184.66, facing: 'East' },
  { plotNo: 3, extentSqYds: 184.5,  facing: 'East' },
  { plotNo: 4, extentSqYds: 184.33, facing: 'East' },
  { plotNo: 5, extentSqYds: 228,    facing: 'North, East' },
  { plotNo: 6, extentSqYds: 239,    facing: 'East, South' },
  { plotNo: 7, extentSqYds: 184,    facing: 'East' },
  { plotNo: 8, extentSqYds: 184.5,  facing: 'West' },
  { plotNo: 9, extentSqYds: 239,    facing: 'West, South' },
  { plotNo: 10, extentSqYds: 227,   facing: 'North, West' },
  { plotNo: 11, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 12, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 13, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 14, extentSqYds: 172.5, facing: 'West' },
  { plotNo: 15, extentSqYds: 177.5, facing: 'East' },
  { plotNo: 16, extentSqYds: 183.33, facing: 'East' },
  { plotNo: 17, extentSqYds: 183.33, facing: 'East' },
  { plotNo: 18, extentSqYds: 183.33, facing: 'East' },
  { plotNo: 19, extentSqYds: 227,   facing: 'North, East' },
  { plotNo: 20, extentSqYds: 239,   facing: 'East, South' },
  { plotNo: 21, extentSqYds: 185,   facing: 'East' },
  { plotNo: 22, extentSqYds: 183.5, facing: 'West' },
  { plotNo: 23, extentSqYds: 239,   facing: 'West, South' },
  { plotNo: 24, extentSqYds: 227,   facing: 'North, West' },
  { plotNo: 25, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 26, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 27, extentSqYds: 183.33, facing: 'West' },
  { plotNo: 28, extentSqYds: 183,   facing: 'West' },
  { plotNo: 29, extentSqYds: 182.5, facing: 'East' },
  { plotNo: 30, extentSqYds: 239,   facing: 'East, South' },
  { plotNo: 31, extentSqYds: 227,   facing: 'North, East' },
  { plotNo: 32, extentSqYds: 238.33, facing: 'East' },
  { plotNo: 33, extentSqYds: 193,   facing: 'West' },
  { plotNo: 34, extentSqYds: 190.5, facing: 'North, West' },
  { plotNo: 35, extentSqYds: 213,   facing: 'West, South' },
  { plotNo: 36, extentSqYds: 206.5, facing: 'West' }
];

export const AYODHARA_SPECS = {
  name: 'Ayodhara',
  tagline: 'Where Every Step Leads You Home',
  location: 'Vizianagaram, Andhra Pradesh',
  totalPlots: 36,
  totalExtentSqYds: 7195.29,
  lpNumber: '83/2026/1167/VMRDA/DPMS',
  approvals: ['VMRDA Approved', 'AP RERA Approved', '100% Vaastu Compliant', 'Clear Title with Immediate Registration'],
  amenities: [
    {
      title: 'Shanti Vanam Park',
      desc: 'Where nature, silence, and serenity meet under curated sacred greenery.',
      icon: 'fa-tree'
    },
    {
      title: 'Tennis Court',
      desc: 'Open-air international grade recreation for an active, mindful community.',
      icon: 'fa-table-tennis-paddle-ball'
    },
    {
      title: "Kids' Play Area",
      desc: 'Playful, visible, secure, and thoughtfully cushioned for young explorers.',
      icon: 'fa-child-reaching'
    },
    {
      title: 'Cycling & Walking Paths',
      desc: 'Dedicated paved tracks fostering a slower, contemplative pace of living.',
      icon: 'fa-person-biking'
    },
    {
      title: 'Landscaped Avenues',
      desc: 'Avenue plantations and native shade trees lining every arterial street.',
      icon: 'fa-leaf'
    },
    {
      title: 'Grand Entrance Arch',
      desc: 'Architectural gateway demarcating sanctuary from the outer world with 24/7 security.',
      icon: 'fa-torii-gate'
    }
  ],
  connectivity: [
    { label: 'Vizianagaram Railway Junction', time: '12 Mins' },
    { label: 'NH-16 Coastal Highway Corridor', time: '8 Mins' },
    { label: 'Bhogapuram International Airport Zone', time: '25 Mins' },
    { label: 'Premier Schools & Universities', time: '10 Mins' },
    { label: 'Super Specialty Healthcare Centers', time: '14 Mins' }
  ]
};
