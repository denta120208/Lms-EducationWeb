package main

import "strconv"

func getString(v interface{}) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
func getInt(v interface{}) int {
	switch val := v.(type) {
	case float64:
		return int(val)
	case int:
		return val
	case string:
		i, _ := strconv.Atoi(val)
		return i
	}
	return 0
}
func getIntPtr(v interface{}) *int {
	i := getInt(v)
	if i == 0 {
		return nil
	}
	return &i
}
func parseQuestions(v interface{}) []CreateQuestionRequest {
	arr, ok := v.([]interface{})
	if !ok {
		return nil
	}
	var res []CreateQuestionRequest
	for _, q := range arr {
		qm, ok := q.(map[string]interface{})
		if !ok {
			continue
		}
		res = append(res, CreateQuestionRequest{
			QuestionType:   getString(qm["question_type"]),
			Points:         getInt(qm["points"]),
			QuestionText:   getString(qm["question"]),
			OptionA:        getString(qm["option_a"]),
			OptionB:        getString(qm["option_b"]),
			OptionC:        getString(qm["option_c"]),
			OptionD:        getString(qm["option_d"]),
			CorrectAnswer:  getString(qm["correct_answer"]),
			EssayAnswerKey: getString(qm["essay_answer_key"]),
		})
	}
	return res
}
