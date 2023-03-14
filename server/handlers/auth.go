package handlers

import (
	authdto "BE/dto/auth"
	dto "BE/dto/result"
	"log"
	"net/http"
	"time"
	"math/rand"
	// "net/smtp"
	"fmt"
	"gopkg.in/gomail.v2"

	"BE/models"
	"BE/pkg/bcrypt"
	jwtToken "BE/pkg/jwt"
	"BE/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerAuth struct {
	AuthRepository repositories.AuthRepository
}

func HandlerAuth(AuthRepository repositories.AuthRepository) *handlerAuth {
	return &handlerAuth{AuthRepository}
}

func generateConfirmationCode() string {
	const length = 20
	letters := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	// generate unique sequence
	rand.Seed(time.Now().UnixNano()) //(time nanosec)
	b := make([]byte, length)
	// looping to generate random character from letters
	for i := range b {
	  b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

//SMTP server (email, psw)
// func sendEmailConfirmation(user models.User) error {
// 	from := "bilqist1234@gmail.com"
// 	password := "hdlhpvzdolakxvzg"
// 	to := []string{user.Email}
// 	subject := "Confirm your email address"
// 	body := fmt.Sprintf("Hi %s,\n\nPlease click the following link to confirm your email address: http://localhost:3000/cofirm-email-status/%s\n\nThanks!", user.Name, user.ConfirmCode)

// 	// auth to gmail acc (identity, user, psw, hostname)
// 	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")
// 	// email content
// 	msg := []byte("To: " + user.Email + "\r\n" +
// 	  "Subject: " + subject + "\r\n" +
// 	  "Content-Type: text/plain; charset=utf-8\r\n" +
// 	  "\r\n" + body + "\r\n")
// 	// error handling
// 	err := smtp.SendMail("smtp.gmail.com:587", auth, from, to, msg)
// 	if err != nil {
// 	  log.Println("Error sending email:", err)
// 	  return err
// 	}
// 	return nil
// }

func sendEmailConfirmation(user models.User) error {
	var CONFIG_SMTP_HOST = "smtp.gmail.com"
	var CONFIG_SMTP_PORT = 587
	var CONFIG_SENDER_NAME = "WaysBeans <bilqist1234@gmail.com>"
	var CONFIG_AUTH_EMAIL = "bilqist1234@gmail.com"
	var CONFIG_AUTH_PASSWORD = "hdlhpvzdolakxvzg"

	mailer := gomail.NewMessage()
	mailer.SetHeader("From", CONFIG_SENDER_NAME)
	mailer.SetHeader("To", user.Email)
	mailer.SetHeader("Subject", "Confirm Your Email Address")
	mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
	<html lang="en">
		<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		</head>
		<body>
		<ul style="list-style-type:none;">
		<li>Hi %s</li>
		<br>
		<li>Please click the following link to confirm your email address: http://localhost:3000/cofirm-email-status/%s</li>
		<br>
		<li>Thank you!</li>
		</ul>
		</body>
	</html>`, user.Name, user.ConfirmCode))

	dialer := gomail.NewDialer(
		CONFIG_SMTP_HOST,
		CONFIG_SMTP_PORT,
		CONFIG_AUTH_EMAIL,
		CONFIG_AUTH_PASSWORD,
	)

	err := dialer.DialAndSend(mailer)
	if err != nil {
		log.Fatal(err.Error())
	}
	log.Println("Mail sent! to " + user.Email)

	return nil
}

func (h *handlerAuth) Register(c echo.Context) error {
	request := new(authdto.AuthRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// Check if email already exists in database
	existingUser, _ := h.AuthRepository.GetUserByEmail(request.Email)
	if existingUser.Email != "" {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "Email already registered"})
	}

	password, err := bcrypt.HashingPassword(request.Password)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	user := models.User{
		Name:     request.Name,
		Email:    request.Email,
		Password: password,
		Image: "",
		Status: "customer",
		IsConfirmed: false,
		ConfirmCode: generateConfirmationCode(),
	}

	data, err := h.AuthRepository.Register(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	sendEmailConfirmation(data)

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerAuth) ConfirmEmail(c echo.Context) error {
	confirmationCode := c.Param("code")
	user, err := h.AuthRepository.GetUserByCode(confirmationCode)
	if err != nil {
	  return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	user.IsConfirmed = true

	data, err := h.AuthRepository.ConfirmEmail(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerAuth) Login(c echo.Context) error {
	request := new(authdto.LoginRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	user := models.User{
		Email:    request.Email,
		Password: request.Password,
	}

	// Check email
	user, err := h.AuthRepository.Login(user.Email)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "wrong email or password"})
	}

	// Check password
	isValid := bcrypt.CheckPasswordHash(request.Password, user.Password)
	if !isValid {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "wrong email or password"})
	}

	//generate token
	claims := jwt.MapClaims{}
	claims["id"] = user.ID
	claims["role"] = user.Name
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix() // 2 hours expired

	token, errGenerateToken := jwtToken.GenerateToken(&claims)
	if errGenerateToken != nil {
		log.Println(errGenerateToken)
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	loginResponse := authdto.LoginResponse{
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
		Image: 	user.Image,
		Status: user.Status,
		IsConfirmed: user.IsConfirmed,
		ConfirmCode: user.ConfirmCode,
		Token:    token,
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: loginResponse})
}

func (h *handlerAuth) GetActiveUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	user, err := h.AuthRepository.GetActiveUser(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: user})
}

func (h *handlerAuth) UpdateActiveUser(c echo.Context) error {
	request := new(authdto.ProfileUpdateRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	user, err := h.AuthRepository.GetActiveUser(userId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Name != "" {
		user.Name = request.Name
	}

	if request.Email != "" {
		user.Email = request.Email
	}

	if request.Password != "" {
		password, err := bcrypt.HashingPassword(request.Password)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
		}
		user.Password = password
	}

	dataFile := c.Get("dataFile").(string)
	if dataFile != "" {
		user.Image = dataFile
	}

	data, err := h.AuthRepository.UpdateActiveUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}
