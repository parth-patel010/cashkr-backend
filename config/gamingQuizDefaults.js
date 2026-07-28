/**
 * Default Gaming Console Category Quiz.
 * deductionValue = percentage (same units as phone).
 * Accessories: positive % when NOT selected; negative % = bonus when selected.
 * Game CDs: negative % = bonus for more discs.
 */

export const GAMING_QUIZ_CATEGORY = 'gaming';

export const DEFAULT_GAMING_QUIZ = {
  category: GAMING_QUIZ_CATEGORY,
  deductionMode: 'universal',
  modelDeductions: [],
  isActive: true,
  windows: [
    {
      id: 'power',
      title: 'Power On',
      question: 'Does the Gaming Console switch on?',
      choiceType: 'single',
      options: [
        { id: 'power_yes', label: 'Yes', emoji: '', icon: '', deductionValue: 0 },
        { id: 'power_no', label: 'No', emoji: '', icon: '', deductionValue: 90 },
      ],
    },
    {
      id: 'physical',
      title: 'Physical Condition',
      question: 'Please select your device physical condition',
      choiceType: 'single',
      options: [
        { id: 'physical_flawless', label: 'Flawless', emoji: '', icon: '', deductionValue: 0 },
        { id: 'physical_good', label: 'Good', emoji: '', icon: '', deductionValue: 5 },
        { id: 'physical_average', label: 'Average', emoji: '', icon: '', deductionValue: 17 },
        { id: 'physical_below', label: 'Below Average', emoji: '', icon: '', deductionValue: 40 },
      ],
    },
    {
      id: 'functional',
      title: 'Functional Condition',
      question: 'Please choose appropriate condition to get accurate quote',
      choiceType: 'multi',
      options: [
        { id: 'gc_cd_drive', label: 'CD Drive not working', emoji: '💿', icon: '💿', deductionValue: 15 },
        { id: 'gc_usb', label: 'USB/Charging port not working', emoji: '🔌', icon: '🔌', deductionValue: 10 },
        { id: 'gc_hdmi', label: 'HDMI output port not working', emoji: '🖥️', icon: '🖥️', deductionValue: 20 },
        { id: 'gc_lan', label: 'LAN port not working', emoji: '🌐', icon: '🌐', deductionValue: 5 },
        { id: 'gc_bluetooth', label: 'Bluetooth not working', emoji: '🔵', icon: '🔵', deductionValue: 39 },
        { id: 'gc_wifi', label: 'WiFi not working', emoji: '📶', icon: '📶', deductionValue: 39 },
      ],
    },
    {
      id: 'accessories',
      title: 'Do you have the following?',
      question: 'Please select accessories which are available',
      choiceType: 'multi',
      options: [
        { id: 'acc_controller', label: 'Original Controller', emoji: '🎮', icon: '🎮', deductionValue: 10 },
        { id: 'acc_charger', label: 'Original Adapter/Charger', emoji: '🔌', icon: '🔌', deductionValue: 3 },
        { id: 'acc_box', label: 'Box', emoji: '📦', icon: '📦', deductionValue: 5 },
        { id: 'acc_bill', label: 'Bill', emoji: '🧾', icon: '🧾', deductionValue: 0 },
        // Bonus when selected (negative %)
        { id: 'acc_extra_controller', label: 'Extra Controller', emoji: '🎮🎮', icon: '🎮', deductionValue: -3 },
      ],
    },
    {
      id: 'game_cds',
      title: 'How many Game CDs do you have?',
      question: 'The Games should be compatible with the Console',
      choiceType: 'single',
      options: [
        { id: 'cds_0', label: '0', emoji: '', icon: '', deductionValue: 0 },
        { id: 'cds_1', label: '1', emoji: '', icon: '', deductionValue: -1 },
        { id: 'cds_2', label: '2', emoji: '', icon: '', deductionValue: -2 },
        { id: 'cds_3', label: '3', emoji: '', icon: '', deductionValue: -3 },
        { id: 'cds_4', label: '4', emoji: '', icon: '', deductionValue: -4 },
        { id: 'cds_5', label: '5', emoji: '', icon: '', deductionValue: -5 },
        { id: 'cds_6', label: '6', emoji: '', icon: '', deductionValue: -6 },
        { id: 'cds_7', label: '7', emoji: '', icon: '', deductionValue: -7 },
        { id: 'cds_8', label: '8', emoji: '', icon: '', deductionValue: -8 },
        { id: 'cds_9', label: '9', emoji: '', icon: '', deductionValue: -9 },
        { id: 'cds_10', label: '10', emoji: '', icon: '', deductionValue: -10 },
      ],
    },
  ],
};
