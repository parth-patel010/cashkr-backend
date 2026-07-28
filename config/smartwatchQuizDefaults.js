/**
 * Default Smartwatch Category Quiz.
 * deductionValue = percentage (same units as phone ISSUE_DEDUCTIONS).
 * Accessories: value is applied when the option is NOT selected.
 */

export const SMARTWATCH_QUIZ_CATEGORY = 'smartwatch';

export const DEFAULT_SMARTWATCH_QUIZ = {
  category: SMARTWATCH_QUIZ_CATEGORY,
  deductionMode: 'universal',
  modelDeductions: [],
  isActive: true,
  windows: [
    {
      id: 'power',
      title: 'Power On',
      question: 'Does the watch Switch On ?',
      choiceType: 'single',
      options: [
        { id: 'power_yes', label: 'Yes', emoji: '', icon: '', deductionValue: 0 },
        { id: 'power_no', label: 'No', emoji: '', icon: '', deductionValue: 90 },
      ],
    },
    {
      id: 'screen',
      title: 'Screen Condition',
      question: 'Please select your device screen condition',
      choiceType: 'single',
      options: [
        { id: 'screen_flawless', label: 'Flawless', emoji: '', icon: '', deductionValue: 0 },
        { id: 'screen_good', label: 'Good', emoji: '', icon: '', deductionValue: 8 },
        { id: 'screen_average', label: 'Average', emoji: '', icon: '', deductionValue: 20 },
        { id: 'screen_damaged', label: 'Damaged', emoji: '', icon: '', deductionValue: 65 },
      ],
    },
    {
      id: 'physical',
      title: 'Physical Condition',
      question: 'Please select your device physical condition.',
      choiceType: 'single',
      options: [
        { id: 'physical_flawless', label: 'Flawless', emoji: '', icon: '', deductionValue: 0 },
        { id: 'physical_good', label: 'Good', emoji: '', icon: '', deductionValue: 5 },
        { id: 'physical_average', label: 'Average', emoji: '', icon: '', deductionValue: 17 },
        { id: 'physical_broken', label: 'Below Average/Broken', emoji: '', icon: '', deductionValue: 40 },
      ],
    },
    {
      id: 'functional',
      title: 'Functional or Physical Problems',
      question: 'Please choose appropriate condition to get accurate quote',
      choiceType: 'multi',
      options: [
        {
          id: 'sw_battery',
          label: 'Battery health less than 89% / battery service',
          emoji: '🔋',
          icon: '🔋',
          deductionValue: 13,
        },
        { id: 'sw_wifi', label: 'Wifi is faulty', emoji: '📶', icon: '📶', deductionValue: 39 },
        { id: 'sw_speakers', label: 'Speakers is faulty', emoji: '🔊', icon: '🔊', deductionValue: 4 },
        {
          id: 'sw_charging',
          label: 'Magnetic charging port is faulty',
          emoji: '⚡',
          icon: '⚡',
          deductionValue: 10,
        },
        { id: 'sw_crown', label: 'Digital crown is faulty', emoji: '⌚', icon: '⌚', deductionValue: 4 },
        { id: 'sw_side_button', label: 'Side button is faulty', emoji: '🔘', icon: '🔘', deductionValue: 2 },
        {
          id: 'sw_heart',
          label: 'Optical heart sensor is faulty',
          emoji: '❤️',
          icon: '❤️',
          deductionValue: 3,
        },
        { id: 'sw_bluetooth', label: 'Bluetooth is faulty', emoji: '🔵', icon: '🔵', deductionValue: 39 },
      ],
    },
    {
      id: 'accessories',
      title: 'Do you have the following?',
      question: 'Please select accessories which are available.',
      choiceType: 'multi',
      options: [
        { id: 'acc_charger', label: 'Charger available', emoji: '🔌', icon: '🔌', deductionValue: 3 },
        { id: 'acc_strap', label: 'Strap Available', emoji: '⌚', icon: '⌚', deductionValue: 5 },
        { id: 'acc_box', label: 'Box available', emoji: '📦', icon: '📦', deductionValue: 5 },
        { id: 'acc_bill', label: 'Valid GST Bill Available', emoji: '🧾', icon: '🧾', deductionValue: 0 },
      ],
    },
  ],
};
