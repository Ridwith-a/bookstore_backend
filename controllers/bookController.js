
const books = require('./model/bookModel')
const stripe = require('stripe')(process.env.STRIPESECRETKEY)

// add a book
exports.addBookController = async (req, res) => {
    // logic
    const { title, author, publisher, language, noofpages, isbn, category, price, dprice, imageUrl, abstract } = req.body
    console.log(title, author, publisher, language, noofpages, isbn, category, price, dprice, imageUrl, abstract);

    console.log(req.files);
    console.log(req.payload);




    try {
        const existingBook = await books.findOne({ title, userMail: req.payload })
        if (existingBook) {
            res.status(401).json('Book Already exist')
        }
        else {
            const newBook = new books({
                title, author, publisher, language, noofpages, isbn, category, price, dprice, imageUrl, abstract, uploadImages: req.files, userMail: req.payload
            })
            await newBook.save()
            res.status(200).json(newBook)
        }


    } catch (error) {
        res.status(500).json(error)
    }
}

// get home books
exports.homeBookController = async (req, res) => {
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all books - user side 

exports.getAllBookUserController = async (req, res) => {
    const { search } = req.query
    console.log(search);

    const userMail = req.payload
    console.log(userMail);

    try {
        const query = {
            title: {
                $regex: search, $options: "i"
            },
            userMail: {
                $ne: userMail
            }
        }

        const allBookUser = await books.find(query)
        console.log(allBookUser);

        res.status(200).json(allBookUser)

    } catch (error) {
        res.status(500).json(error)
    }
}

// get a particular book
exports.viewBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const specificBook = await books.findOne({ _id: id })
        res.status(200).json(specificBook)
    } catch (error) {
        res.status(500).json(error)
    }

}

// get all user added Book
exports.getAllUserAddedController = async (req, res) => {
    const userMail = req.payload
    try {

        const alluserAddedBooks = await books.find({ BroughtBy: userMail })
        res.status(200).json(alluserAddedBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}



// get all user brought Book
exports.getAllUserBroughtController = async (req, res) => {
    const userMail = req.payload
    try {

        const alluserBroughtBooks = await books.find({ BroughtBy: userMail })
        res.status(200).json(alluserBroughtBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

// to delete a particular book
exports.deleteBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('deleted')

    } catch (error) {
        res.status(500).json(error)
    }

}

// make payment 
exports.paymentController = async (req, res) => {
    const email = req.payload
    console.log(email);

    const { bookDetails } = req.body
    console.log(bookDetails);

    try {

        // const existingBook = await books.findByIdAndUpdate({ _id: bookDetails._id }, {
        //     title: bookDetails.title,
        //     author: bookDetails.author,
        //     publisher: bookDetails.publisher,
        //     language: bookDetails.language,
        //     noofpages: bookDetails.noofpages,
        //     isbn: bookDetails.isbn,
        //     category: bookDetails.category,
        //     price: bookDetails.price,
        //     dprice: bookDetails.dprice,
        //     imageUrl: bookDetails.imageUrl,
        //     abstract: bookDetails.abstract,
        //      uploadImages: bookDetails.uploadImages,
        //     userMail: bookDetails.userMail,
        //     status: 'sold',
        //     BroughtBy: email

        // }, { new: true })

        // console.log(existingBook);

        const line_item = [{
            price_data: {
                currency: 'usd',//dollars
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imageUrl],
                    metadata: {
                        title: bookDetails.title,
                        author: bookDetails.author,
                        publisher: bookDetails.publisher,
                        language: bookDetails.language,
                        noofpages: bookDetails.noofpages,
                        isbn: bookDetails.isbn,
                        category: bookDetails.category,
                        price: `${bookDetails.price}`,
                        dprice: `${bookDetails.dprice}`,
                        imageUrl: bookDetails.imageUrl,
                        abstract: bookDetails.abstract.slice(0, 20),
                        // uploadImages: bookDetails.uploadImages,
                        userMail: bookDetails.userMail,
                        status: 'sold',
                        BroughtBy: email
                    }

                },
                unit_amount: Math.round(bookDetails.dprice * 100)//cents
            },
            quantity: 1

        }]
        console.log();
        

        // create a checkout session fror stripe
        const session = await stripe.checkout.sessions.create({
            // payment type
            payment_method_types: ['card'],
            //    details of purchsed products
            line_items: line_item,
            mode: 'payment',
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-error'

        })
        console.log(session);
        res.status(200).json({ sessionId: session.id })



    } catch (error) {
        res.status(500).json(error)
    }



}

// --------------ADMIN----------------

// to get all books 
exports.getAllBookController = async (req, res) => {
    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

// approve book
exports.approveBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const existingBook = await books.findOne({ _id: id })
        const UpdatedBook = await books.findByIdAndUpdate({ _id: id }, {
            title: existingBook.title,
            author: existingBook.author,
            publisher: existingBook.publisher,
            language: existingBook.publisher,
            noofpages: existingBook.noofpages,
            isbn: existingBook.isbn,
            category: existingBook.category,
            price: existingBook.price,
            dprice: existingBook.dprice,
            imageUrl: existingBook.imageUrl,
            abstract: existingBook.abstract,
            uploadImages: existingBook.uploadImages,
            userMail: existingBook.userMail,
            status: 'Approved',
            BroughtBy: ""


        }, { new: true })
        res.status(200).json(UpdatedBook)

    } catch (error) {
        res.status(500).json(error)
    }

}