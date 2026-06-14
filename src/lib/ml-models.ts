
import { z } from 'zod';

export const ModelTypeSchema = z.enum([
  // Regression Models
  'linear-regression',
  'decision-tree-regressor',
  'svm-regressor',
  'knn-regressor',
  'random-forest-regressor',
  // Classification Models
  'logistic-regression', // Typically for classification
  'decision-tree-classifier',
  'svm-classifier',
  'knn-classifier',
  'random-forest-classifier',
]);
export type ModelType = z.infer<typeof ModelTypeSchema>;

export const TaskTypeSchema = z.enum(['regression', 'classification']);
export type TaskType = z.infer<typeof TaskTypeSchema>;

export const RegressionMetricsSchema = z.object({
  mse: z.number().describe('Mean Squared Error'),
  rmse: z.number().describe('Root Mean Squared Error'),
  mae: z.number().describe('Mean Absolute Error'),
  rSquared: z.number().describe('R-squared'),
});
export type RegressionMetrics = z.infer<typeof RegressionMetricsSchema>;

export const ConfusionMatrixSchema = z.object({
  tp: z.number().describe('True Positives'),
  tn: z.number().describe('True Negatives'),
  fp: z.number().describe('False Positives'),
  fn: z.number().describe('False Negatives'),
  matrix: z.array(z.array(z.number())).optional().describe('Full confusion matrix for multi-class, array of arrays.'),
  labels: z.array(z.string()).optional().describe('Labels for multi-class confusion matrix.'),
});
export type ConfusionMatrix = z.infer<typeof ConfusionMatrixSchema>;

export const ClassificationMetricsSchema = z.object({
  accuracy: z.number().describe('Accuracy'),
  precision: z.number().describe('Precision (macro-averaged for multi-class)'),
  recall: z.number().describe('Recall (macro-averaged for multi-class)'),
  f1Score: z.number().describe('F1-Score (macro-averaged for multi-class)'),
  confusionMatrix: ConfusionMatrixSchema.describe('Confusion Matrix. For binary classification, tp, tn, fp, fn are primary. For multi-class, matrix and labels are used.'),
  rocAuc: z.number().optional().describe('Area Under the ROC Curve (for binary classification or one-vs-rest for multi-class). May not be available for all models.'),
  rocCurveData: z.array(z.object({ fpr: z.number(), tpr: z.number() })).optional().describe('Points for plotting ROC curve. Array of {fpr, tpr} objects (for binary classification).'),
});
export type ClassificationMetrics = z.infer<typeof ClassificationMetricsSchema>;

export const ModelMetricsSchema = z.union([
  RegressionMetricsSchema,
  ClassificationMetricsSchema,
]);
export type ModelMetrics = z.infer<typeof ModelMetricsSchema>;

export const FeatureImportanceSchema = z.object({
  feature: z.string(),
  importance: z.number(),
});
export type FeatureImportance = z.infer<typeof FeatureImportanceSchema>;

export const TrainModelInputSchema = z.object({
  csvData: z.string().describe('The uploaded CSV data as a string.'),
  targetColumn: z.string().describe('The name of the target column.'),
  featureColumns: z
    .array(z.string())
    .describe('The names of the feature columns.'),
  modelType: ModelTypeSchema.describe('The type of machine learning model to train.'),
});
export type TrainModelInput = z.infer<typeof TrainModelInputSchema>;

export const TrainModelOutputSchemaCustom = z.object({
  modelType: ModelTypeSchema.describe('The type of model trained.'),
  taskType: TaskTypeSchema.describe('The type of task performed (regression or classification).'),
  targetColumn: z.string().describe('The name of the original target column from the input data.'),
  featureColumnsUsed: z.array(z.string()).describe('The names of the feature columns used for training the model.'),
  predictions: z.array(z.union([z.number(), z.string()])).describe('The predicted values (numbers for regression, class labels for classification) on the test set.'),
  actuals: z.array(z.union([z.number(), z.string()])).optional().describe('The actual values from the test set.'),
  metrics: ModelMetricsSchema.describe('Performance metrics of the model.'),
  featureImportances: z.array(FeatureImportanceSchema).optional().describe('Feature importance scores, if applicable for the model.'),
  trainingTime: z.number().optional().describe('Time taken to train the model in milliseconds.'),
});
export type TrainModelOutputCustom = z.infer<typeof TrainModelOutputSchemaCustom>;


export function getTaskType(modelType: ModelType): TaskType {
  if (modelType.endsWith('classifier') || modelType === 'logistic-regression') {
    return 'classification';
  }
  return 'regression';
}

export const AVAILABLE_MODELS: { value: ModelType; label: string; task: TaskType }[] = [
  { value: 'linear-regression', label: 'Linear Regression', task: 'regression' },
  { value: 'decision-tree-regressor', label: 'Decision Tree Regressor', task: 'regression' },
  { value: 'svm-regressor', label: 'Support Vector Regressor (SVM)', task: 'regression' },
  { value: 'knn-regressor', label: 'K-Nearest Neighbors Regressor (KNN)', task: 'regression' },
  { value: 'random-forest-regressor', label: 'Random Forest Regressor', task: 'regression' },
  { value: 'logistic-regression', label: 'Logistic Regression', task: 'classification' },
  { value: 'decision-tree-classifier', label: 'Decision Tree Classifier', task: 'classification' },
  { value: 'svm-classifier', label: 'Support Vector Classifier (SVM)', task: 'classification' },
  { value: 'knn-classifier', label: 'K-Nearest Neighbors Classifier (KNN)', task: 'classification' },
  { value: 'random-forest-classifier', label: 'Random Forest Classifier', task: 'classification' },
];
