/**
 * Default Earbuds / AirPods Category Quiz.
 * deductionValue = % (phone-style cascading).
 * Accessories: positive % when NOT selected.
 * Either Box or Bill required at pickup (enforced in UI).
 */

export const EARBUDS_QUIZ_CATEGORY = 'earbuds';

export const DEFAULT_EARBUDS_QUIZ = {
  category: EARBUDS_QUIZ_CATEGORY,
  deductionMode: 'universal',
  modelDeductions: [],
  isActive: true,
  windows: [
    {
      id: 'power',
      title: 'Power On',
      question: 'Does Your Device Switch On Successfully?',
      choiceType: 'single',
      options: [
        { id: 'power_yes', label: 'Yes', emoji: '👍', icon: '👍', deductionValue: 0 },
        { id: 'power_no', label: 'No', emoji: '👎', icon: '👎', deductionValue: 90 },
      ],
    },
    {
      id: 'voice_mic',
      title: 'Voice / Mic',
      question: 'Does Your Device Have Voice And/Or Mic Issues?',
      choiceType: 'single',
      options: [
        { id: 'voice_ok', label: 'Working Properly', emoji: '👍', icon: '👍', deductionValue: 0 },
        { id: 'voice_faulty', label: 'Faulty Voice/Mic', emoji: '👎', icon: '👎', deductionValue: 20 },
      ],
    },
    {
      id: 'connectivity',
      title: 'Connectivity',
      question: 'Does Your Device Have Connectivity Issues?',
      choiceType: 'single',
      options: [
        { id: 'conn_ok', label: 'Working Properly', emoji: '👍', icon: '👍', deductionValue: 0 },
        { id: 'conn_faulty', label: 'Faulty Connectivity', emoji: '👎', icon: '👎', deductionValue: 35 },
      ],
    },
    {
      id: 'physical',
      title: 'Physical Damage',
      question: 'Does Your Device Have Any Physical Damage?',
      choiceType: 'single',
      options: [
        { id: 'physical_ok', label: 'No Damage', emoji: '👍', icon: '👍', deductionValue: 0 },
        { id: 'physical_damaged', label: 'Damaged Physically', emoji: '👎', icon: '👎', deductionValue: 40 },
      ],
    },
    {
      id: 'accessories',
      title: 'Accessories',
      question: 'Select Original Accessories You Have?',
      choiceType: 'multi',
      options: [
        { id: 'acc_box', label: 'Box', emoji: '📦', icon: '📦', deductionValue: 5 },
        { id: 'acc_case', label: 'Charging Case', emoji: '🎧', icon: '🎧', deductionValue: 25 },
        { id: 'acc_cable', label: 'Charging Cable', emoji: '🔌', icon: '🔌', deductionValue: 3 },
        { id: 'acc_bill', label: 'Bill', emoji: '🧾', icon: '🧾', deductionValue: 0 },
      ],
    },
    {
      id: 'age',
      title: 'Device Age',
      question: 'How Old Is Your Device?',
      choiceType: 'single',
      options: [
        { id: 'age_0_3', label: 'Below 3 Months', emoji: '📅', icon: '📅', deductionValue: 0 },
        { id: 'age_3_6', label: 'Between 3-6 Months', emoji: '📅', icon: '📅', deductionValue: 7 },
        { id: 'age_6_11', label: 'Between 6-11 Months', emoji: '📅', icon: '📅', deductionValue: 10 },
        { id: 'age_11_plus', label: 'Above 11 Months', emoji: '📅', icon: '📅', deductionValue: 15 },
      ],
    },
  ],
};
