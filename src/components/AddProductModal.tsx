import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, Grid } from '@mui/material';
import toast from 'react-hot-toast';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


interface AddProductModalProps {
    open: boolean;
    handleClose: () => void;
    onSubmit: (productData: any) => void;
}

export default function AddProductModal({ open, handleClose, onSubmit }: AddProductModalProps) {
    const [productName, setProductName] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [transactionType, setTransactionType] = React.useState("selling");
    const [price, setPrice] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [currency, setCurrency] = React.useState("USD");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const productData = {
            productName,
            description,
            price,
            paymentMethod,
            category,
            transactionType,
            currency,
        };
        console.log(productData);

        try {
            const response = await fetch("api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            onSubmit(data); // Trigger the parent component callback with the new product data
            toast.success(`${data.productName} added successfully`);

            handleClose();

        } catch (error) {
            console.error("There was a problem submitting the form:", error);
            toast.error("There was a problem submitting the form");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Product
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    value={productName}
                                    name="productName"
                                    onChange={(e) => setProductName(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Category"
                                    value={category}
                                    name="category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    value={price}
                                    name="price"
                                    onChange={(e) => setPrice(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Payment Method"
                                    value={paymentMethod}
                                    name="paymentMethod"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={description}
                                    name="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading}
                                    endIcon={isLoading && <CircularProgress size={20} />}
                                >
                                    Add Product
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
