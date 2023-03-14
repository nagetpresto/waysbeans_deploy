package cartsdto

import (
	"BE/models"
)

type CreateCartRequest struct {
	UserID    	  int `json:"user_id"`
	ProductID     int `json:"product_id"`
	Qty           int `json:"qty"`
}

type UpdateCartRequest struct {
	Qty           int `json:"qty"`
}

type CartResponse struct {
	ID        	  int			 `json:"id"`
	UserID    	  int 			 `json:"user_id"`
	ProductID     int            `json:"product_id"`
	Product       models.Product `json:"product"`
	Qty           int            `json:"qty"`
	TransactionID int            `json:"transaction_id"`
}