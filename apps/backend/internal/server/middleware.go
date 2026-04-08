package server

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

// ApplyProdMiddleware configures production middleware (minimal, no CORS).
func ApplyProdMiddleware(e *echo.Echo) {
	// Logger middleware (optional, enabled via env)
	if os.Getenv("ENABLE_LOGGING") == "true" {
		logger, _ := zap.NewProduction()
		e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
			LogStatus:  true,
			LogMethod:  true,
			LogURI:     true,
			LogError:   true,
			LogLatency: true,
			LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
				logger.Info("request",
					zap.String("method", v.Method),
					zap.String("uri", v.URI),
					zap.Int("status", v.Status),
					zap.Duration("latency", v.Latency),
				)
				return nil
			},
		}))
	}

	// Recovery middleware last (catches panics from all middleware/handlers)
	e.Use(middleware.Recover())

	// No CORS in production (same-origin)
}

// ApplyDevMiddleware configures development middleware (logging, CORS, recovery).
func ApplyDevMiddleware(e *echo.Echo) {
	// CORS middleware for development (allow all origins)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS, echo.PATCH},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization, "X-Requested-With"},
		AllowCredentials: false,
		MaxAge:           3600,
	}))

	// Request logging middleware
	logger, _ := zap.NewDevelopment()
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:  true,
		LogMethod:  true,
		LogURI:     true,
		LogError:   true,
		LogLatency: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			logger.Info("request",
				zap.String("method", v.Method),
				zap.String("uri", v.URI),
				zap.Int("status", v.Status),
				zap.Duration("latency", v.Latency),
			)
			return nil
		},
	}))

	// Recovery middleware last (catches panics from all middleware/handlers)
	e.Use(middleware.Recover())
}
