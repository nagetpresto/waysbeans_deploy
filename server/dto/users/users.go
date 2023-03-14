package usersdto

type CreateUserRequest struct {
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
}

type UpdateUserRequest struct {
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
}

type UserResponse struct {
	ID       int    `json:"Id" form:"id"`
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
	Status	 string `json:"status"`
}