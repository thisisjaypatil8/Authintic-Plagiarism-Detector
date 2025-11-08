from project import create_app

# Create the app instance using our factory
app = create_app()

if __name__ == '__main__':
    # Run the app
    # Note: We set debug=True here for development
    app.run(debug=True, port=5001)