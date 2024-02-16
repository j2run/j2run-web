-- Auto-generated SQL script #202402162351
INSERT INTO public.category_entity (id,"name")
	VALUES (1,'Cloud J2ME');
INSERT INTO public.category_entity (id,"name")
	VALUES (2,'Cloud Android');
INSERT INTO public.category_entity (id,"name")
	VALUES (3,'Web Builder');


-- Auto-generated SQL script #202402162352
INSERT INTO public.product_entity (id,"name","categoryId")
	VALUES (1,'Web Builder Free',3);
INSERT INTO public.product_entity (id,"name","categoryId")
	VALUES (2,'Web Builder Gold',3);

-- Auto-generated SQL script #202402162356
INSERT INTO public.product_retal_option_entity (price,"usageTime","productId")
	VALUES (0,-1,1);
INSERT INTO public.product_retal_option_entity (price,"usageTime","productId")
	VALUES (12000,2592000,2);
INSERT INTO public.product_retal_option_entity (price,"usageTime","productId")
	VALUES (34500,7776000,2);
INSERT INTO public.product_retal_option_entity (price,"usageTime","productId")
	VALUES (66000,15552000,2);
INSERT INTO public.product_retal_option_entity (price,"usageTime","productId")
	VALUES (114000,31104000,2);
